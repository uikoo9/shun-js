// react
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// css
import './index.scss';
import './cards.scss';
import banner from './banner.webp';

// ui
import { Header, Footer, Modal, Button, Viewer, Alert } from 'qiao-ui';

// components
import { Login } from '@components';

// services
import { genChart } from '@services';

// data
import { reportWebData } from '@util/data.js';

// util
import { getUserinfo } from '@util/userinfo.js';

// constants
import { siteName, siteUrl, textareaPlaceholder, showCards } from '@util/constants.js';

/**
 * index view
 */
const IndexView = () => {
  // state
  const [isLogin, setIsLogin] = useState(false);
  const [loginBtnTxt, setLoginBtnTxt] = useState('登录/注册');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [bannerSrc, setBannerSrc] = useState(banner);
  const [textareaContent, setTextareaContent] = useState('');
  const [textareaDisabled, setTextareaDisabled] = useState(false);
  const [runBtnTxt, setRunBtnTxt] = useState('生成图表');
  const [viewerShow, setViewerShow] = useState(false);
  const [viewerSrc, setViewerSrc] = useState(banner);
  const [alertShow, setAlertShow] = useState(false);
  const [alertContent, setAlertContent] = useState('');

  // effect report
  useEffect(() => {
    reportWebData('view.index');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // effect userinfo
  useEffect(() => {
    const userinfo = getUserinfo();
    if (userinfo && userinfo.usermobile) {
      setIsLogin(true);
      setLoginBtnTxt(userinfo.usermobile);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // alert it
  const alertIt = (msg) => {
    setAlertContent(msg);
    setAlertShow(true);
    setTimeout(() => {
      setAlertShow(false);
    }, 2000);
  };

  // chart
  const chart = async () => {
    reportWebData('click.btn', 'index.run');

    // check
    if (!isLogin) {
      setShowLoginModal(true);
      return;
    }
    if (!textareaContent) {
      alertIt('请填写用户提示词！');
      return;
    }

    // chart
    setTextareaDisabled(true);
    setRunBtnTxt('生成中，请稍候。。。');
    const res = await genChart(textareaContent);
    setTextareaDisabled(false);
    setRunBtnTxt('生成图表');

    // check res
    if (!res || res.type !== 'success') {
      alertIt(res.msg);
      return;
    }
    if (!res.obj || !res.obj.content || !res.obj.content.length) {
      alertIt('解析服务端响应失败！');
      return;
    }

    // r
    const content = res.obj.content[0];
    const src = content[content.type];
    setBannerSrc(src);
    alertIt('图表生成成功，点击图片查看大图！');
  };

  return (
    <div className="container">
      {/* header */}
      <Header
        logo={siteName}
        logoUrl={siteUrl}
        navs={[
          {
            name: loginBtnTxt,
            onClick: () => {
              if (isLogin) return;

              reportWebData('click.btn', 'index.login');
              setShowLoginModal(true);
            },
          },
          {
            blank: true,
            name: 'AI白板',
            url: 'https://aibaiban.com/',
          },
          {
            blank: true,
            name: 'MCP列表',
            url: 'https://mcp-servers.online/',
          },
        ]}
      />

      {/* banner */}
      <div className="banner">
        <div className="banner-img">
          <img
            src={bannerSrc}
            alt="banner"
            onClick={() => {
              reportWebData('click.btn', 'index.banner');
              setViewerSrc(bannerSrc);
              setViewerShow(true);
            }}
          />
        </div>
        <div className="banner-run">
          <div className="banner-textarea">
            <textarea
              placeholder={textareaPlaceholder}
              maxLength={2000}
              disabled={textareaDisabled}
              value={textareaContent}
              onChange={(e) => {
                setTextareaContent(e.target.value);
              }}
            ></textarea>
          </div>
          <div className="banner-button">
            <Button text={runBtnTxt} onClick={chart} />
          </div>
        </div>
      </div>

      {/* cards */}
      <div className="cards-container">
        {showCards.map((card, index) => {
          return (
            <div className="card-row" key={index}>
              <div className="card-img">
                <img
                  src={card.img}
                  alt={card.title}
                  onClick={() => {
                    reportWebData('click.btn', 'img.bingtu');
                    setViewerSrc(card.img);
                    setViewerShow(true);
                  }}
                />
              </div>
              <div className="card-tip">
                <div className="card-title">{card.title}</div>
                <div className="card-prompt">{card.desc}</div>
                <div className="card-btn">
                  <Button
                    text="试一试"
                    onClick={() => {
                      setTextareaContent(card.desc);
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth', // 平滑滚动
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* footer */}
      <Footer companyName={siteName} companyUrl={siteUrl} />

      {/* login */}
      <div className="login-modal">
        <Modal
          width="400px"
          show={showLoginModal}
          closeModal={() => {
            setShowLoginModal(false);
          }}
        >
          <Login />
        </Modal>
      </div>

      {/* viewer */}
      <Viewer
        src={viewerSrc}
        show={viewerShow}
        close={() => {
          setViewerShow(false);
        }}
      />

      {/* alert */}
      <Alert show={alertShow} content={alertContent} />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<IndexView />);
