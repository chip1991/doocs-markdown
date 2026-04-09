import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ReadTimeResults } from 'reading-time'
import DEFAULT_CONTENT from '@/assets/example/markdown.md?raw'
import DEFAULT_CSS_CONTENT from '@/assets/example/theme-css.txt?raw'
import { codeBlockThemeOptions, colorOptions, fontFamilyOptions, fontSizeOptions, legendOptions, themeMap, themeOptions } from '@/config'
import { css2json, customCssWithTemplate, customizeTheme, downloadMD, exportHTML, formatDoc } from '@/utils'
import { initRenderer } from '@/utils/renderer'
import CodeMirror from 'codemirror'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { toast } from 'sonner'

export interface Post {
  title: string
  content: string
}

export interface CssTab {
  name: string
  title: string
  content: string
}

export interface CssContentConfig {
  active: string
  tabs: CssTab[]
}

export interface GithubConfig {
  repo: string
  branch: string
  accessToken: string
}

export interface AliOSSConfig {
  accessKeyId: string
  accessKeySecret: string
  bucket: string
  region: string
  useSSL: boolean
  cdnHost: string
  path: string
}

export interface TxCOSConfig {
  secretId: string
  secretKey: string
  bucket: string
  region: string
  cdnHost: string
  path: string
}

export interface QiniuConfig {
  accessKey: string
  secretKey: string
  bucket: string
  domain: string
  region: string
  path: string
}

export interface MinioConfig {
  endpoint: string
  port: string
  useSSL: boolean
  bucket: string
  accessKey: string
  secretKey: string
}

export interface MpConfig {
  proxyOrigin: string
  appID: string
  appsecret: string
}

export interface R2Config {
  accountId: string
  accessKey: string
  secretKey: string
  bucket: string
  domain: string
  path: string
}

interface AppState {
  isDark: boolean
  isMacCodeBlock: boolean
  isEditOnLeft: boolean
  isCiteStatus: boolean
  isCountStatus: boolean
  isUseIndent: boolean
  theme: keyof typeof themeMap
  fontFamily: string
  fontSize: string
  primaryColor: string
  codeBlockTheme: string
  legend: string
  isOpenRightSlider: boolean
  isOpenPostSlider: boolean
  isCopying: boolean
  posts: Post[]
  currentPostIndex: number
  cssContentConfig: CssContentConfig

  imgHost: string
  githubConfig: GithubConfig
  aliOSSConfig: AliOSSConfig
  txCOSConfig: TxCOSConfig
  qiniuConfig: QiniuConfig
  minioConfig: MinioConfig
  mpConfig: MpConfig
  r2Config: R2Config
  formCustomConfig: string

  // Persisted state setters
  toggleDark: (isDark?: boolean) => void
  toggleMacCodeBlock: (isMacCodeBlock?: boolean) => void
  toggleEditOnLeft: (isEditOnLeft?: boolean) => void
  toggleCiteStatus: (isCiteStatus?: boolean) => void
  toggleCountStatus: (isCountStatus?: boolean) => void
  toggleUseIndent: (isUseIndent?: boolean) => void
  setTheme: (theme: keyof typeof themeMap) => void
  setFontFamily: (fontFamily: string) => void
  setFontSize: (fontSize: string) => void
  setPrimaryColor: (primaryColor: string) => void
  setCodeBlockTheme: (codeBlockTheme: string) => void
  setLegend: (legend: string) => void
  setIsOpenRightSlider: (isOpen: boolean) => void
  setIsOpenPostSlider: (isOpen: boolean) => void
  setIsCopying: (isCopying: boolean) => void
  setPosts: (posts: Post[]) => void
  setCurrentPostIndex: (index: number) => void
  setCssContentConfig: (config: CssContentConfig) => void

  setImgHost: (imgHost: string) => void
  setGithubConfig: (config: GithubConfig) => void
  setAliOSSConfig: (config: AliOSSConfig) => void
  setTxCOSConfig: (config: TxCOSConfig) => void
  setQiniuConfig: (config: QiniuConfig) => void
  setMinioConfig: (config: MinioConfig) => void
  setMpConfig: (config: MpConfig) => void
  setR2Config: (config: R2Config) => void
  setFormCustomConfig: (config: string) => void

  addPost: (title: string) => void
  renamePost: (index: number, title: string) => void
  delPost: (index: number) => void
  addCssContentTab: (name: string) => void
  renameTab: (name: string) => void
  tabChanged: (name: string) => void
  validatorTabName: (val: string) => boolean
  getCurrentTab: () => CssTab
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isDark: false, // Default is usually checked via system preference, but setting false for simplicity
      isMacCodeBlock: true,
      isEditOnLeft: true,
      isCiteStatus: false,
      isCountStatus: false,
      isUseIndent: false,
      theme: themeOptions[0].value,
      fontFamily: fontFamilyOptions[0].value,
      fontSize: fontSizeOptions[2].value,
      primaryColor: colorOptions[0].value,
      codeBlockTheme: codeBlockThemeOptions[23].value,
      legend: legendOptions[3].value,
      isOpenRightSlider: false,
      isOpenPostSlider: false,
      isCopying: false,
      posts: [{ title: '内容1', content: DEFAULT_CONTENT }],
      currentPostIndex: 0,
      cssContentConfig: {
        active: '方案1',
        tabs: [
          {
            title: '方案1',
            name: '方案1',
            content: DEFAULT_CSS_CONTENT,
          },
        ],
      },

      imgHost: 'default',
      githubConfig: { repo: '', branch: '', accessToken: '' },
      aliOSSConfig: { accessKeyId: '', accessKeySecret: '', bucket: '', region: '', useSSL: true, cdnHost: '', path: '' },
      txCOSConfig: { secretId: '', secretKey: '', bucket: '', region: '', cdnHost: '', path: '' },
      qiniuConfig: { accessKey: '', secretKey: '', bucket: '', domain: '', region: '', path: '' },
      minioConfig: { endpoint: '', port: '', useSSL: true, bucket: '', accessKey: '', secretKey: '' },
      mpConfig: { proxyOrigin: '', appID: '', appsecret: '' },
      r2Config: { accountId: '', accessKey: '', secretKey: '', bucket: '', domain: '', path: '' },
      formCustomConfig: `
const {file, util, okCb, errCb} = CUSTOM_ARG
const param = new FormData()
param.append('file', file)
util.axios.post('${typeof window !== "undefined" ? window.location.origin : ""}/upload', param, {
  headers: { 'Content-Type': 'multipart/form-data' }
}).then(res => {
  okCb(res.url)
}).catch(err => {
  errCb(err)
})
      `.trim(),

      toggleDark: (isDark) => set((state) => ({ isDark: isDark ?? !state.isDark })),
      toggleMacCodeBlock: (isMacCodeBlock) => set((state) => ({ isMacCodeBlock: isMacCodeBlock ?? !state.isMacCodeBlock })),
      toggleEditOnLeft: (isEditOnLeft) => set((state) => ({ isEditOnLeft: isEditOnLeft ?? !state.isEditOnLeft })),
      toggleCiteStatus: (isCiteStatus) => set((state) => ({ isCiteStatus: isCiteStatus ?? !state.isCiteStatus })),
      toggleCountStatus: (isCountStatus) => set((state) => ({ isCountStatus: isCountStatus ?? !state.isCountStatus })),
      toggleUseIndent: (isUseIndent) => set((state) => ({ isUseIndent: isUseIndent ?? !state.isUseIndent })),
      setTheme: (theme) => set({ theme }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setFontSize: (fontSize) => set({ fontSize }),
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setCodeBlockTheme: (codeBlockTheme) => set({ codeBlockTheme }),
      setLegend: (legend) => set({ legend }),
      setIsOpenRightSlider: (isOpen) => set({ isOpenRightSlider: isOpen }),
      setIsOpenPostSlider: (isOpen) => set({ isOpenPostSlider: isOpen }),
      setIsCopying: (isCopying) => set({ isCopying }),
      setPosts: (posts) => set({ posts }),
      setCurrentPostIndex: (index) => set({ currentPostIndex: index }),
      setCssContentConfig: (config) => set({ cssContentConfig: config }),

      setImgHost: (imgHost) => set({ imgHost }),
      setGithubConfig: (config) => set({ githubConfig: config }),
      setAliOSSConfig: (config) => set({ aliOSSConfig: config }),
      setTxCOSConfig: (config) => set({ txCOSConfig: config }),
      setQiniuConfig: (config) => set({ qiniuConfig: config }),
      setMinioConfig: (config) => set({ minioConfig: config }),
      setMpConfig: (config) => set({ mpConfig: config }),
      setR2Config: (config) => set({ r2Config: config }),
      setFormCustomConfig: (config) => set({ formCustomConfig: config }),

      addPost: (title) => set((state) => {
        const newPosts = [...state.posts, { title, content: `# ${title}` }]
        return { posts: newPosts, currentPostIndex: newPosts.length - 1 }
      }),
      renamePost: (index, title) => set((state) => {
        const newPosts = [...state.posts]
        newPosts[index].title = title
        return { posts: newPosts }
      }),
      delPost: (index) => set((state) => {
        const newPosts = [...state.posts]
        newPosts.splice(index, 1)
        return { posts: newPosts, currentPostIndex: Math.min(index, newPosts.length - 1) }
      }),
      addCssContentTab: (name) => set((state) => {
        const newConfig = { ...state.cssContentConfig }
        newConfig.tabs.push({ name, title: name, content: DEFAULT_CSS_CONTENT })
        newConfig.active = name
        return { cssContentConfig: newConfig }
      }),
      renameTab: (name) => set((state) => {
        const newConfig = { ...state.cssContentConfig }
        const tab = newConfig.tabs.find(t => t.name === newConfig.active)
        if (tab) {
          tab.title = name
          tab.name = name
          newConfig.active = name
        }
        return { cssContentConfig: newConfig }
      }),
      tabChanged: (name) => set((state) => {
        return { cssContentConfig: { ...state.cssContentConfig, active: name } }
      }),
      validatorTabName: (val) => {
        return get().cssContentConfig.tabs.every(({ name }) => name !== val)
      },
      getCurrentTab: () => {
        const state = get()
        return state.cssContentConfig.tabs.find((tab) => tab.name === state.cssContentConfig.active)!
      }
    }),
    {
      name: 'doocs-md-storage',
      partialize: (state) => ({
        isDark: state.isDark,
        isMacCodeBlock: state.isMacCodeBlock,
        isEditOnLeft: state.isEditOnLeft,
        isCiteStatus: state.isCiteStatus,
        isCountStatus: state.isCountStatus,
        isUseIndent: state.isUseIndent,
        theme: state.theme,
        fontFamily: state.fontFamily,
        fontSize: state.fontSize,
        primaryColor: state.primaryColor,
        codeBlockTheme: state.codeBlockTheme,
        legend: state.legend,
        isOpenRightSlider: state.isOpenRightSlider,
        isOpenPostSlider: state.isOpenPostSlider,
        posts: state.posts,
        currentPostIndex: state.currentPostIndex,
        cssContentConfig: state.cssContentConfig,
        imgHost: state.imgHost,
        githubConfig: state.githubConfig,
        aliOSSConfig: state.aliOSSConfig,
        txCOSConfig: state.txCOSConfig,
        qiniuConfig: state.qiniuConfig,
        minioConfig: state.minioConfig,
        mpConfig: state.mpConfig,
        r2Config: state.r2Config,
        formCustomConfig: state.formCustomConfig,
      }),
    }
  )
)

interface NonPersistedState {
  output: string
  editor: CodeMirror.EditorFromTextArea | null
  cssEditor: CodeMirror.EditorFromTextArea | null
  readingTime: ReadTimeResults | null
  isOpenConfirmDialog: boolean
  renderer: ReturnType<typeof initRenderer>

  setOutput: (output: string) => void
  setEditor: (editor: CodeMirror.EditorFromTextArea | null) => void
  setCssEditor: (cssEditor: CodeMirror.EditorFromTextArea | null) => void
  setReadingTime: (readingTime: ReadTimeResults | null) => void
  setIsOpenConfirmDialog: (isOpen: boolean) => void

  editorRefresh: () => void
  formatContent: () => void
  exportEditorContent2HTML: () => void
  exportEditorContent2MD: () => void
  importMarkdownContent: () => void
  importDefaultContent: () => void
  resetStyleConfirm: () => void
  resetStyle: () => void
  updateCss: () => void
}

// Instantiate renderer once
const initialRenderer = initRenderer({
  theme: customCssWithTemplate(css2json(DEFAULT_CSS_CONTENT), colorOptions[0].value, customizeTheme(themeMap[themeOptions[0].value], { fontSize: Number(fontSizeOptions[2].value.replace('px', '')), color: colorOptions[0].value })),
  fonts: fontFamilyOptions[0].value,
  size: fontSizeOptions[2].value,
  isUseIndent: false,
})

export const useStore = create<NonPersistedState>()((set, get) => ({
  output: '',
  editor: null,
  cssEditor: null,
  readingTime: null,
  isOpenConfirmDialog: false,
  renderer: initialRenderer,

  setOutput: (output) => set({ output }),
  setEditor: (editor) => set({ editor }),
  setCssEditor: (cssEditor) => set({ cssEditor }),
  setReadingTime: (readingTime) => set({ readingTime }),
  setIsOpenConfirmDialog: (isOpen) => set({ isOpenConfirmDialog: isOpen }),

  editorRefresh: () => {
    const state = get()
    const appState = useAppStore.getState()
    
    // codeThemeChange
    const cssUrl = appState.codeBlockTheme
    const el = document.querySelector('#hljs')
    if (el) {
      el.setAttribute('href', cssUrl)
    } else {
      const link = document.createElement('link')
      link.setAttribute('type', 'text/css')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('href', cssUrl)
      link.setAttribute('id', 'hljs')
      document.head.appendChild(link)
    }

    state.renderer.reset({ citeStatus: appState.isCiteStatus, legend: appState.legend, isUseIndent: appState.isUseIndent, countStatus: appState.isCountStatus })

    if (!state.editor) return
    const { markdownContent, readingTime: readingTimeResult } = state.renderer.parseFrontMatterAndContent(state.editor.getValue())
    set({ readingTime: readingTimeResult })
    let outputTemp = marked.parse(markdownContent) as string
    outputTemp = DOMPurify.sanitize(outputTemp)

    outputTemp = state.renderer.buildReadingTime(readingTimeResult) + outputTemp
    outputTemp = outputTemp.replace(/(style=".*?)"/, '$1;margin-top: 0"')
    outputTemp += state.renderer.buildFootnotes()
    outputTemp += state.renderer.buildAddition()

    if (appState.isMacCodeBlock) {
      outputTemp += `
        <style>
          .hljs.code__pre > .mac-sign {
            display: flex;
          }
        </style>
      `
    }

    outputTemp += `
      <style>
        .code__pre {
          padding: 0 !important;
        }
        .hljs.code__pre code {
          display: -webkit-box;
          padding: 0.5em 1em 1em;
          overflow-x: auto;
          text-indent: 0;
        }
      </style>
    `

    set({ output: state.renderer.createContainer(outputTemp) })
  },

  formatContent: () => {
    const state = get()
    if (!state.editor) return
    formatDoc(state.editor.getValue()).then((doc) => {
      const appState = useAppStore.getState()
      appState.renamePost(appState.currentPostIndex, appState.posts[appState.currentPostIndex].title) // hack to update title? no
      const newPosts = [...appState.posts]
      newPosts[appState.currentPostIndex].content = doc
      useAppStore.setState({ posts: newPosts })
      state.editor!.setValue(doc)
    })
  },

  exportEditorContent2HTML: () => {
    const appState = useAppStore.getState()
    appState.setIsCopying(true)
    setTimeout(() => {
      exportHTML(appState.primaryColor)
      appState.setIsCopying(false)
    }, 500)
  },

  exportEditorContent2MD: () => {
    const state = get()
    const appState = useAppStore.getState()
    if (state.editor) {
      appState.setIsCopying(true)
      setTimeout(() => {
        downloadMD(state.editor!.getValue())
        appState.setIsCopying(false)
      }, 500)
    }
  },

  importDefaultContent: () => {
    const state = get()
    if (state.editor) {
      state.editor.setValue(DEFAULT_CONTENT)
      toast.success('文档已重置为默认文档')
    }
  },

  importMarkdownContent: () => {
    const state = get()
    const body = document.body
    const input = document.createElement('input')
    input.type = 'file'
    input.name = 'filename'
    input.accept = '.md'
    input.onchange = () => {
      const file = input.files![0]
      if (!file) return
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (event) => {
        if (state.editor) {
          state.editor.setValue(event.target!.result as string)
          toast.success('文档导入成功')
        }
      }
    }
    body.appendChild(input)
    input.click()
    body.removeChild(input)
  },

  resetStyleConfirm: () => {
    set({ isOpenConfirmDialog: true })
  },

  resetStyle: () => {
    useAppStore.setState({
      isCiteStatus: false,
      isMacCodeBlock: true,
      isCountStatus: false,
      theme: themeOptions[0].value,
      fontFamily: fontFamilyOptions[0].value,
      fontSize: fontSizeOptions[2].value,
      primaryColor: colorOptions[0].value,
      codeBlockTheme: codeBlockThemeOptions[23].value,
      legend: legendOptions[3].value,
      cssContentConfig: {
        active: '方案 1',
        tabs: [
          {
            title: '方案 1',
            name: '方案 1',
            content: DEFAULT_CSS_CONTENT,
          },
        ],
      }
    })
    
    const state = get()
    if (state.cssEditor) {
      state.cssEditor.setValue(DEFAULT_CSS_CONTENT)
    }
    state.updateCss()
    state.editorRefresh()
    toast.success('样式重置成功~')
  },

  updateCss: () => {
    const state = get()
    const appState = useAppStore.getState()
    if (!state.cssEditor) return
    const json = css2json(state.cssEditor.getValue())
    const fontSizeNumber = Number(appState.fontSize.replace('px', ''))
    const newTheme = customCssWithTemplate(json, appState.primaryColor, customizeTheme(themeMap[appState.theme], { fontSize: fontSizeNumber, color: appState.primaryColor }))
    state.renderer.setOptions({
      theme: newTheme,
    })
    state.editorRefresh()
  }
}))

// Wrapper functions to keep the exact same API as the old code for theme changes
export const themeChanged = (newTheme: keyof typeof themeMap) => {
  const appState = useAppStore.getState()
  const state = useStore.getState()
  const fontSizeNumber = Number(appState.fontSize.replace('px', ''))
  state.renderer.setOptions({
    theme: customCssWithTemplate(css2json(appState.getCurrentTab().content), appState.primaryColor, customizeTheme(themeMap[newTheme], { fontSize: fontSizeNumber })),
  })
  useAppStore.setState({ theme: newTheme })
  state.editorRefresh()
}

export const fontChanged = (fonts: string) => {
  const state = useStore.getState()
  state.renderer.setOptions({ fonts })
  useAppStore.setState({ fontFamily: fonts })
  state.editorRefresh()
}

export const sizeChanged = (size: string) => {
  const appState = useAppStore.getState()
  const state = useStore.getState()
  const fontSizeNumber = Number(size.replace('px', ''))
  const newTheme = customCssWithTemplate(css2json(appState.getCurrentTab().content), appState.primaryColor, customizeTheme(themeMap[appState.theme], { fontSize: fontSizeNumber, color: appState.primaryColor }))
  state.renderer.setOptions({ size, theme: newTheme })
  useAppStore.setState({ fontSize: size })
  state.editorRefresh()
}

export const colorChanged = (newColor: string) => {
  const appState = useAppStore.getState()
  const state = useStore.getState()
  const fontSizeNumber = Number(appState.fontSize.replace('px', ''))
  const newTheme = customCssWithTemplate(css2json(appState.getCurrentTab().content), newColor, customizeTheme(themeMap[appState.theme], { fontSize: fontSizeNumber, color: newColor }))
  state.renderer.setOptions({ theme: newTheme })
  useAppStore.setState({ primaryColor: newColor })
  state.editorRefresh()
}

export const codeBlockThemeChanged = (newTheme: string) => {
  useAppStore.setState({ codeBlockTheme: newTheme })
  useStore.getState().editorRefresh()
}

export const legendChanged = (newVal: string) => {
  useAppStore.setState({ legend: newVal })
  useStore.getState().editorRefresh()
}

export const macCodeBlockChanged = (val: boolean) => {
  useAppStore.getState().toggleMacCodeBlock(val)
  useStore.getState().editorRefresh()
}

export const citeStatusChanged = (val: boolean) => {
  useAppStore.getState().toggleCiteStatus(val)
  useStore.getState().editorRefresh()
}

export const countStatusChanged = (val: boolean) => {
  useAppStore.getState().toggleCountStatus(val)
  useStore.getState().editorRefresh()
}

export const useIndentChanged = (val: boolean) => {
  useAppStore.getState().toggleUseIndent(val)
  useStore.getState().editorRefresh()
}


interface DisplayState {
  isShowCssEditor: boolean
  isShowInsertFormDialog: boolean
  isShowUploadImgDialog: boolean
  isShowAboutDialog: boolean
  toggleShowCssEditor: (show?: boolean) => void
  toggleShowInsertFormDialog: (show?: boolean) => void
  toggleShowUploadImgDialog: (show?: boolean) => void
  toggleShowAboutDialog: (show?: boolean) => void
}

export const useDisplayStore = create<DisplayState>()((set) => ({
  isShowCssEditor: false,
  isShowInsertFormDialog: false,
  isShowUploadImgDialog: false,
  isShowAboutDialog: false,
  toggleShowCssEditor: (show) => set((state) => ({ isShowCssEditor: show ?? !state.isShowCssEditor })),
  toggleShowInsertFormDialog: (show) => set((state) => ({ isShowInsertFormDialog: show ?? !state.isShowInsertFormDialog })),
  toggleShowUploadImgDialog: (show) => set((state) => ({ isShowUploadImgDialog: show ?? !state.isShowUploadImgDialog })),
  toggleShowAboutDialog: (show) => set((state) => ({ isShowAboutDialog: show ?? !state.isShowAboutDialog })),
}))
