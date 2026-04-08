import { browser } from 'wxt/browser';
import './popup.css';

export default function App() {
  const onOpenOption = () => {
    browser.runtime.openOptionsPage();
  };

  return (
    <div className="container popup-body">
      <div
        className="title"
        style={{ height: '40px', display: 'inline-flex', paddingLeft: '60px' }}
      >
        <img style={{ height: '40px' }} src="/mpmd/logo.svg" alt="logo" />
        <span
          style={{
            fontSize: '16px',
            lineHeight: '40px',
            fontWeight: 'bold',
            marginLeft: '8px',
          }}
        >
          使用必读
        </span>
      </div>
      <section style={{ marginTop: '12px', lineHeight: '28px' }}>
        <div>如果您希望使用微信公众号素材库作为图床功能，需要进行以下配置：</div>
        <div>
          1.开启公众号开发者模式
          <span>
            <a
              href="https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Getting_Started_Guide.html"
              target="_blank"
              rel="noreferrer"
            >
              查看文档
            </a>
          </span>
        </div>
        <div>
          2.配置IP白名单
          <span>
            <a
              href="https://mpmd.pages.dev/tutorial"
              target="_blank"
              rel="noreferrer"
            >
              使用教程
            </a>
          </span>
        </div>
        <div>
          <button className="button" onClick={onOpenOption}>
            开始使用
          </button>
        </div>
      </section>
    </div>
  );
}
