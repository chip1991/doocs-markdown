import { useState, useRef } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { useDisplayStore, useAppStore } from '@/stores'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { UploadCloud } from 'lucide-react'
import { toast } from 'sonner'
import { checkImage } from '@/utils'
import { CustomUploadForm } from './CustomUploadForm'

const options = [
  { value: 'default', label: '默认' },
  { value: 'github', label: 'GitHub' },
  { value: 'aliOSS', label: '阿里云' },
  { value: 'txCOS', label: '腾讯云' },
  { value: 'qiniu', label: '七牛云' },
  { value: 'minio', label: 'MinIO' },
  { value: 'mp', label: '公众号图床' },
  { value: 'r2', label: 'Cloudflare R2' },
  { value: 'formCustom', label: '自定义代码' },
]

export function UploadImgDialog({ onUploadImage }: { onUploadImage: (file: File) => void }) {
  const { isShowUploadImgDialog, toggleShowUploadImgDialog } = useDisplayStore()
  
  const {
    imgHost, setImgHost,
    githubConfig, setGithubConfig,
    aliOSSConfig, setAliOSSConfig,
    txCOSConfig, setTxCOSConfig,
    qiniuConfig, setQiniuConfig,
    minioConfig, setMinioConfig,
    mpConfig, setMpConfig,
    r2Config, setR2Config
  } = useAppStore()

  const [activeName, setActiveName] = useState('upload')
  const [dragover, setDragover] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isWebsite = typeof window !== 'undefined' && window.location.href.startsWith('http')

  const changeImgHost = (val: string) => {
    setImgHost(val)
    toast.success('已成功切换图床')
  }

  const beforeImageUpload = (file: File) => {
    const checkResult = checkImage(file)
    if (!checkResult.ok) {
      toast.error(checkResult.msg || '')
      return false
    }

    const isValidHost = imgHost === 'default' || (useAppStore.getState() as any)[`${imgHost}Config`]
    if (!isValidHost) {
      toast.error(`请先配置 ${imgHost} 图床参数`)
      return false
    }
    return true
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    if (beforeImageUpload(file)) {
      onUploadImage(file)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragover(false)
    const files = e.dataTransfer.files
    if (!files || files.length === 0) return
    const file = files[0]
    if (beforeImageUpload(file)) {
      onUploadImage(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragover(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragover(false)
  }

  return (
    <Dialog open={isShowUploadImgDialog} onOpenChange={toggleShowUploadImgDialog}>
      <DialogContent className="max-w-max" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>本地上传</DialogTitle>
        </DialogHeader>

        <Tabs value={activeName} onValueChange={setActiveName} className="w-max">
          <TabsList>
            <TabsTrigger value="upload">选择上传</TabsTrigger>
            {options.filter(item => item.value !== 'default').map(item => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="upload" className="py-4">
            <Label className="my-4 block">图床</Label>
            <Select value={imgHost} onValueChange={changeImgHost}>
              <SelectTrigger>
                <SelectValue placeholder="请选择" />
              </SelectTrigger>
              <SelectContent>
                {options.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div
              className={`bg-clip-padding mt-4 h-50 flex flex-col cursor-pointer items-center justify-evenly border-2 rounded border-dashed transition-colors hover:border-gray-700 hover:bg-gray-400/50 dark:hover:border-gray-200 dark:hover:bg-gray-500/50 py-10 ${
                dragover ? 'border-gray-700 bg-gray-400/50 dark:border-gray-200 dark:bg-gray-500/50' : ''
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <UploadCloud className="size-20 mb-4" />
              <p>
                将图片拖到此处，或
                <strong>点击上传</strong>
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
          </TabsContent>

          <TabsContent value="github" className="py-4">
            <form onSubmit={(e) => { e.preventDefault(); toast.success('保存成功') }} className="space-y-4 w-[400px]">
              <div>
                <Label>GitHub 仓库</Label>
                <Input required value={githubConfig.repo} onChange={e => setGithubConfig({...githubConfig, repo: e.target.value})} placeholder="如：github.com/yanglbme/resource" />
              </div>
              <div>
                <Label>分支</Label>
                <Input value={githubConfig.branch} onChange={e => setGithubConfig({...githubConfig, branch: e.target.value})} placeholder="如：release，可不填，默认 master" />
              </div>
              <div>
                <Label>Token</Label>
                <Input type="password" value={githubConfig.accessToken} onChange={e => setGithubConfig({...githubConfig, accessToken: e.target.value})} placeholder="如：cc1d0c1426d0fd0902bd2d7184b14da61b8abc46" />
              </div>
              <Button variant="link" className="p-0" asChild>
                <a href="https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token" target="_blank" rel="noreferrer">如何获取 GitHub Token？</a>
              </Button>
              <Button type="submit" className="w-full">保存配置</Button>
            </form>
          </TabsContent>

          <TabsContent value="aliOSS" className="py-4">
            <form onSubmit={(e) => { e.preventDefault(); toast.success('保存成功') }} className="space-y-4 w-[400px]">
              <div>
                <Label>AccessKey ID</Label>
                <Input required value={aliOSSConfig.accessKeyId} onChange={e => setAliOSSConfig({...aliOSSConfig, accessKeyId: e.target.value})} placeholder="如：LTAI4GdoocsmdoxUf13ylbaNHk" />
              </div>
              <div>
                <Label>AccessKey Secret</Label>
                <Input required type="password" value={aliOSSConfig.accessKeySecret} onChange={e => setAliOSSConfig({...aliOSSConfig, accessKeySecret: e.target.value})} placeholder="如：cc1d0c142doocs0902bd2d7md4b14da6ylbabc46" />
              </div>
              <div>
                <Label>Bucket</Label>
                <Input required value={aliOSSConfig.bucket} onChange={e => setAliOSSConfig({...aliOSSConfig, bucket: e.target.value})} placeholder="如：doocs" />
              </div>
              <div>
                <Label>Bucket 所在区域</Label>
                <Input required value={aliOSSConfig.region} onChange={e => setAliOSSConfig({...aliOSSConfig, region: e.target.value})} placeholder="如：oss-cn-shenzhen" />
              </div>
              <div className="flex items-center space-x-2">
                <Label>UseSSL</Label>
                <Switch checked={aliOSSConfig.useSSL} onCheckedChange={c => setAliOSSConfig({...aliOSSConfig, useSSL: c})} />
              </div>
              <div>
                <Label>自定义 CDN 域名</Label>
                <Input value={aliOSSConfig.cdnHost} onChange={e => setAliOSSConfig({...aliOSSConfig, cdnHost: e.target.value})} placeholder="如：https://imagecdn.alidaodao.com，可不填" />
              </div>
              <div>
                <Label>存储路径</Label>
                <Input value={aliOSSConfig.path} onChange={e => setAliOSSConfig({...aliOSSConfig, path: e.target.value})} placeholder="如：img，可不填，默认为根目录" />
              </div>
              <Button variant="link" className="p-0" asChild>
                <a href="https://help.aliyun.com/document_detail/31883.html" target="_blank" rel="noreferrer">如何使用阿里云 OSS？</a>
              </Button>
              <Button type="submit" className="w-full">保存配置</Button>
            </form>
          </TabsContent>

          <TabsContent value="txCOS" className="py-4">
            <form onSubmit={(e) => { e.preventDefault(); toast.success('保存成功') }} className="space-y-4 w-[400px]">
              <div>
                <Label>SecretId</Label>
                <Input required value={txCOSConfig.secretId} onChange={e => setTxCOSConfig({...txCOSConfig, secretId: e.target.value})} placeholder="如：AKIDnQp1w3DOOCSs8F5MDp9tdoocsmdUPonW3" />
              </div>
              <div>
                <Label>SecretKey</Label>
                <Input required type="password" value={txCOSConfig.secretKey} onChange={e => setTxCOSConfig({...txCOSConfig, secretKey: e.target.value})} placeholder="如：ukLmdtEJ9271f3DOocsMDsCXdS3YlbW0" />
              </div>
              <div>
                <Label>Bucket</Label>
                <Input required value={txCOSConfig.bucket} onChange={e => setTxCOSConfig({...txCOSConfig, bucket: e.target.value})} placeholder="如：doocs-3212520134" />
              </div>
              <div>
                <Label>Bucket 所在区域</Label>
                <Input required value={txCOSConfig.region} onChange={e => setTxCOSConfig({...txCOSConfig, region: e.target.value})} placeholder="如：ap-guangzhou" />
              </div>
              <div>
                <Label>自定义 CDN 域名</Label>
                <Input value={txCOSConfig.cdnHost} onChange={e => setTxCOSConfig({...txCOSConfig, cdnHost: e.target.value})} placeholder="如：https://imagecdn.alidaodao.com，可不填" />
              </div>
              <div>
                <Label>存储路径</Label>
                <Input value={txCOSConfig.path} onChange={e => setTxCOSConfig({...txCOSConfig, path: e.target.value})} placeholder="如：img，可不填，默认根目录" />
              </div>
              <Button variant="link" className="p-0" asChild>
                <a href="https://cloud.tencent.com/document/product/436/38484" target="_blank" rel="noreferrer">如何使用腾讯云 COS？</a>
              </Button>
              <Button type="submit" className="w-full">保存配置</Button>
            </form>
          </TabsContent>

          <TabsContent value="qiniu" className="py-4">
            <form onSubmit={(e) => { e.preventDefault(); toast.success('保存成功') }} className="space-y-4 w-[400px]">
              <div>
                <Label>AccessKey</Label>
                <Input required value={qiniuConfig.accessKey} onChange={e => setQiniuConfig({...qiniuConfig, accessKey: e.target.value})} placeholder="如：6DD3VaLJ_SQgOdoocsyTV_YWaDmdnL2n8EGx7kG" />
              </div>
              <div>
                <Label>SecretKey</Label>
                <Input required type="password" value={qiniuConfig.secretKey} onChange={e => setQiniuConfig({...qiniuConfig, secretKey: e.target.value})} placeholder="如：qgZa5qrvDOOcsmdKStD1oCjZ9nB7MDvJUs_34SIm" />
              </div>
              <div>
                <Label>Bucket</Label>
                <Input required value={qiniuConfig.bucket} onChange={e => setQiniuConfig({...qiniuConfig, bucket: e.target.value})} placeholder="如：md" />
              </div>
              <div>
                <Label>Bucket 对应域名</Label>
                <Input required value={qiniuConfig.domain} onChange={e => setQiniuConfig({...qiniuConfig, domain: e.target.value})} placeholder="如：https://images.123ylb.cn" />
              </div>
              <div>
                <Label>存储区域</Label>
                <Input value={qiniuConfig.region} onChange={e => setQiniuConfig({...qiniuConfig, region: e.target.value})} placeholder="如：z2，可不填" />
              </div>
              <div>
                <Label>存储路径</Label>
                <Input value={qiniuConfig.path} onChange={e => setQiniuConfig({...qiniuConfig, path: e.target.value})} placeholder="如：img，可不填，默认为根目录" />
              </div>
              <Button variant="link" className="p-0" asChild>
                <a href="https://developer.qiniu.com/kodo" target="_blank" rel="noreferrer">如何使用七牛云 Kodo？</a>
              </Button>
              <Button type="submit" className="w-full">保存配置</Button>
            </form>
          </TabsContent>

          <TabsContent value="minio" className="py-4">
            <form onSubmit={(e) => { e.preventDefault(); toast.success('保存成功') }} className="space-y-4 w-[400px]">
              <div>
                <Label>Endpoint</Label>
                <Input required value={minioConfig.endpoint} onChange={e => setMinioConfig({...minioConfig, endpoint: e.target.value})} placeholder="如：play.min.io" />
              </div>
              <div>
                <Label>Port</Label>
                <Input type="number" value={minioConfig.port} onChange={e => setMinioConfig({...minioConfig, port: e.target.value})} placeholder="如：9000，可不填，http 默认为 80，https 默认为 443" />
              </div>
              <div className="flex items-center space-x-2">
                <Label>UseSSL</Label>
                <Switch checked={minioConfig.useSSL} onCheckedChange={c => setMinioConfig({...minioConfig, useSSL: c})} />
              </div>
              <div>
                <Label>Bucket</Label>
                <Input required value={minioConfig.bucket} onChange={e => setMinioConfig({...minioConfig, bucket: e.target.value})} placeholder="如：doocs" />
              </div>
              <div>
                <Label>AccessKey</Label>
                <Input required value={minioConfig.accessKey} onChange={e => setMinioConfig({...minioConfig, accessKey: e.target.value})} placeholder="如：zhangsan" />
              </div>
              <div>
                <Label>SecretKey</Label>
                <Input required value={minioConfig.secretKey} onChange={e => setMinioConfig({...minioConfig, secretKey: e.target.value})} placeholder="如：asdasdasd" />
              </div>
              <Button variant="link" className="p-0" asChild>
                <a href="http://docs.minio.org.cn/docs/master/minio-client-complete-guide" target="_blank" rel="noreferrer">如何使用 MinIO？</a>
              </Button>
              <Button type="submit" className="w-full">保存配置</Button>
            </form>
          </TabsContent>

          <TabsContent value="mp" className="py-4">
            <form onSubmit={(e) => { e.preventDefault(); toast.success('保存成功') }} className="space-y-4 w-[400px]">
              <div>
                <Label>代理域名 {isWebsite && <span className="text-red-500">*</span>}</Label>
                <Input required={isWebsite} value={mpConfig.proxyOrigin} onChange={e => setMpConfig({...mpConfig, proxyOrigin: e.target.value})} placeholder="如：http://proxy.example.com，使用插件时可不填" />
              </div>
              <div>
                <Label>appID</Label>
                <Input required value={mpConfig.appID} onChange={e => setMpConfig({...mpConfig, appID: e.target.value})} placeholder="如：wx6e1234567890efa3" />
              </div>
              <div>
                <Label>appsecret</Label>
                <Input required value={mpConfig.appsecret} onChange={e => setMpConfig({...mpConfig, appsecret: e.target.value})} placeholder="如：d9f1abcdef01234567890abcdef82397" />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Getting_Started_Guide.html" target="_blank" rel="noreferrer">如何开启公众号开发者模式并获取应用账号密钥？</a>
                </Button>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="https://mpmd.pages.dev/tutorial/" target="_blank" rel="noreferrer">如何在浏览器插件中使用公众号图床？</a>
                </Button>
              </div>
              <Button type="submit" className="w-full">保存配置</Button>
            </form>
          </TabsContent>

          <TabsContent value="r2" className="py-4">
            <form onSubmit={(e) => { e.preventDefault(); toast.success('保存成功') }} className="space-y-4 w-[400px]">
              <div>
                <Label>AccountId</Label>
                <Input required value={r2Config.accountId} onChange={e => setR2Config({...r2Config, accountId: e.target.value})} placeholder="如: 0030f123e55a57546f4c281c564e560" />
              </div>
              <div>
                <Label>AccessKey</Label>
                <Input required value={r2Config.accessKey} onChange={e => setR2Config({...r2Config, accessKey: e.target.value})} placeholder="如: 358090b3a12824a6b0787gae7ad0fc72" />
              </div>
              <div>
                <Label>SecretKey</Label>
                <Input required type="password" value={r2Config.secretKey} onChange={e => setR2Config({...r2Config, secretKey: e.target.value})} placeholder="如: c1c4dbcb0b6b785ac6633422a06dff3dac055fe74fe40xj1b5c5fcf1bf128010" />
              </div>
              <div>
                <Label>Bucket</Label>
                <Input required value={r2Config.bucket} onChange={e => setR2Config({...r2Config, bucket: e.target.value})} placeholder="如：md" />
              </div>
              <div>
                <Label>域名</Label>
                <Input required value={r2Config.domain} onChange={e => setR2Config({...r2Config, domain: e.target.value})} placeholder="如：https://oss.example.com" />
              </div>
              <div>
                <Label>存储路径</Label>
                <Input value={r2Config.path} onChange={e => setR2Config({...r2Config, path: e.target.value})} placeholder="如：img，可不填，默认为根目录" />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="https://developers.cloudflare.com/r2/api/s3/api/" target="_blank" rel="noreferrer">如何使用 S3 API 操作 Cloudflare R2</a>
                </Button>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="https://developers.cloudflare.com/r2/buckets/cors/" target="_blank" rel="noreferrer">如何设置跨域(CORS)</a>
                </Button>
              </div>
              <Button type="submit" className="w-full">保存配置</Button>
            </form>
          </TabsContent>

          <TabsContent value="formCustom" className="py-4 w-[400px]">
            <CustomUploadForm />
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
