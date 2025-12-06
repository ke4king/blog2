#!/usr/bin/env bun
import { mkdir, readdir, readFile, rm, writeFile, access } from 'node:fs/promises'
import path from 'node:path'

const BLOG_DIR = path.resolve(process.cwd(), 'src/content/blog')

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/

async function main() {
  const entries = await readdir(BLOG_DIR, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue
    const fullPath = path.join(BLOG_DIR, entry.name)

    try {
      await processMarkdown(fullPath)
    } catch (error) {
      console.error(`处理 ${entry.name} 失败:`, error)
    }
  }
}

async function processMarkdown(filePath: string) {
  const fileName = path.basename(filePath)
  const slug = fileName.replace(/\.mdx?$/, '')
  const targetDir = path.join(BLOG_DIR, slug)
  const targetMarkdownPath = path.join(targetDir, 'index.md')

  await mkdir(targetDir, { recursive: true })

  const raw = await readFile(filePath, 'utf8')
  const match = FRONTMATTER_REGEX.exec(raw)

  if (!match) {
    console.warn(`[跳过] ${fileName} 没有 frontmatter 块`)
    await writeFile(targetMarkdownPath, raw, 'utf8')
    await rm(filePath)
    return
  }

  const frontmatter = match[1]
  const restContent = raw.slice(match[0].length)

  const { updatedFrontmatter, downloadedImageRelative } = await transformHeroImage(frontmatter, targetDir)

  const updatedContent = `---\n${updatedFrontmatter}\n---${restContent}`
  await writeFile(targetMarkdownPath, updatedContent, 'utf8')
  await rm(filePath)

  console.log(`✔ ${fileName} 已移动至 ${path.relative(process.cwd(), targetMarkdownPath)}`)
  if (downloadedImageRelative) {
    console.log(`  ↳ heroImage 已更新为 ${downloadedImageRelative}`)
  }
}

async function transformHeroImage(frontmatter: string, targetDir: string) {
  const heroObjectRegex = /heroImage\s*:\s*\{([\s\S]*?)\}/m
  const heroMatch = frontmatter.match(heroObjectRegex)

  if (!heroMatch) {
    return { updatedFrontmatter: frontmatter, downloadedImageRelative: null }
  }

  const heroBlock = heroMatch[0]
  const heroInner = heroMatch[1]

  const srcMatch = heroInner.match(/src\s*:\s*['"]([^'"]+)['"]/)

  if (!srcMatch) {
    console.warn(`[提示] heroImage 块缺少 src 字段，跳过下载`)
    return { updatedFrontmatter: frontmatter, downloadedImageRelative: null }
  }

  const currentSrc = srcMatch[1]

  if (!isRemoteUrl(currentSrc)) {
    // 已经是本地图片
    return { updatedFrontmatter: frontmatter, downloadedImageRelative: null }
  }

  const { localRelative, updatedHeroBlock } = await downloadAndRewriteHeroBlock({
    heroBlock,
    heroInner,
    remoteSrc: currentSrc,
    targetDir
  })

  const updatedFrontmatter = frontmatter.replace(heroBlock, updatedHeroBlock)

  return { updatedFrontmatter, downloadedImageRelative: localRelative }
}

async function downloadAndRewriteHeroBlock({
  heroBlock,
  heroInner,
  remoteSrc,
  targetDir
}: {
  heroBlock: string
  heroInner: string
  remoteSrc: string
  targetDir: string
}) {
  const url = new URL(remoteSrc)
  let fileName = path.basename(url.pathname)

  if (!fileName || fileName === '/' || fileName.includes('..')) {
    const extension = path.extname(url.pathname) || '.webp'
    fileName = `hero${extension}`
  }

  const destination = path.join(targetDir, fileName)
  const localRelative = `./${fileName}`

  if (!(await exists(destination))) {
    console.log(`  ↳ 下载 ${remoteSrc}`)
    const response = await fetch(remoteSrc)

    if (!response.ok) {
      throw new Error(`下载失败 (${response.status} ${response.statusText})`)
    }

    const arrayBuffer = await response.arrayBuffer()
    await writeFile(destination, Buffer.from(arrayBuffer))
  } else {
    console.log(`  ↳ 本地已存在 ${localRelative}，跳过下载`)
  }

  const updatedHeroInner = rewriteHeroInner(heroInner, localRelative)
  const updatedHeroBlock = `heroImage: {\n${updatedHeroInner}\n}`

  return { localRelative, updatedHeroBlock }
}

function rewriteHeroInner(heroInner: string, localRelative: string) {
  const lines = heroInner.split(/\r?\n/)
  const updated: string[] = []

  for (const line of lines) {
    const trimmed = line.trimStart()

    if (!trimmed) continue

    if (trimmed.startsWith('src')) {
      const indentation = line.slice(0, line.length - trimmed.length)
      updated.push(`${indentation}src: '${localRelative}'`)
      continue
    }

    if (trimmed.startsWith('inferSize')) {
      // 本地图片不再需要 inferSize
      continue
    }

    updated.push(line)
  }

  if (!updated.some((line) => line.trimStart().startsWith('src'))) {
    updated.unshift(`    src: '${localRelative}'`)
  }

  return updated.join('\n')
}

function isRemoteUrl(value: string) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch (error) {
    return false
  }
}

async function exists(filePath: string) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
