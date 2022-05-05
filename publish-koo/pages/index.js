import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Script from 'next/script'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import React, { useState } from 'react';
import {useMediaQuery} from 'react-responsive';

export default function Home() {
  const [url, setUrl] = useState('');
  const [copy, setCopy] = useState(false);
  const [show, setShow] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({ minDeviceWidth: 1224 });
  const [view,setView] = useState(isDesktopOrLaptop?'desktop':'mobile');
  const check = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const reg = RegExp(/http(?:s)?:\/\/(?:www\.)?kooapp\.com\/([a-zA-Z0-9_]+)/);
      if (!(reg.test(url))) {
        alert("Please enter Koo url!");
      }
      else {
        setShow(true);
      }
    }
  }

  const getNewCode = (ansId) => {
    const embedKooBaseURL = `https://embed.kooapp.com`;
    return `<blockquote class="koo-media" data-koo-permalink="${embedKooBaseURL}/embedKoo?kooId=${ansId}" style="background:transparent;border: medium none;padding: 0;margin: 25px auto; max-width: 550px;"></blockquote><img style="display: none; height: 0; width: 0" src="https://embed.kooapp.com/dolon.png?id=${ansId}"> <script src="${embedKooBaseURL}/embedLoader.js"></script>`;
  }

  const getArrow = () => {
    return (<span>
      <img
        onClick={() => setShow(true)}
        src="/img/arrow_right.svg"
        style={{ padding: '.5em', width: '1.8em' }}
        alt="enter"
      />
    </span>)
  }

  const getKooCode = (url) => {
    const ansId = /[^/]*$/.exec(url)[0];
    const code = getNewCode(ansId);
    return (

      <div className={styles.codeContainer}>
        <div className={styles.code1}>
          <div className={styles.codeContainer1} >
            <code>{code}</code>
          </div>
          {/* <div className={styles.codeBlockOverlay}>
            Click the below button to copy the code!
          </div> */}
        </div>

        <div>
          <CopyToClipboard
            text={code}
            onCopy={() => {
              setCopy(true);
              setTimeout(() => {
                setCopy(false);
              }, 1000);
            }}
          >
            <button
              className={styles.copyBtn}
            >
              {copy ? (
                'Copied...'
              ) : (
                <span> Copy code</span>
              )}
            </button>
          </CopyToClipboard>
        </div>
      </div>
    );
  }
  const getKooPreview = (url) => {
    const ansId = /[^/]*$/.exec(url)[0];
    const script = document.createElement("script");
    script.src = './script.js';
    script.async = true;
    document.body.appendChild(script);
    document.body.removeChild(script);

    return (
      <div className={styles.previewBox}>
            
       { isDesktopOrLaptop &&
       <div className={styles.children1}>
         <div>
            <button
              className={styles.copyBtn}
              onClick={()=>setView('desktop')}
              style={{
                color: view==='mobile'? '#5d7681':'#fff',
                backgroundColor: view==='mobile'?'#FFF':'#5d7681',
              }}
            >
              Desktop
            </button>
          </div>
          <div>
            <button
              className={styles.copyBtn}
              onClick={()=>setView('mobile')}
              style={{
                color: view==='desktop'? '#5d7681':'#fff',
                backgroundColor: view==='desktop'?'#FFF':'#5d7681',
              }}
            >
              Mobile
            </button></div>
          

        </div>}
       
        <div className={styles.children2}
        style={{
          minWidth: view === 'mobile'  ? '300px':'450px',
          overflow: 'auto'
        }
        }>
          <blockquote className="koo-media" data-koo-permalink={`https://embed.kooapp.com/embedKoo?kooId=${ansId}`} style={{ background: 'transparent', border: 'medium none', padding: '0', margin: '25px auto', maxWidth: '550px' }}>
          </blockquote>
          {/* <Script id="script1" src="/script.js" strategy="lazyOnload" /> */}
        </div>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Koo Publish</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="https://www.kooapp.com/img/logoKuSolidOutline.svg"/>
      </Head>

      <div className={styles.header}>
        <div className={styles.headerText} >
          <img className={styles.image} src="https://www.kooapp.com/img/logoKuSolidOutline.svg" />
          Koo Publish</div>
      </div>

      <div className={styles.main}>
        <div className={styles.parent}>
          <div className={styles.child1}>
            <div className={styles.title}>
              What would you like to embed?
            </div>

            <div className={styles.page}>
              <input
                list="browsers"
                placeholder=' Enter Koo URL'
                className={styles.selectdropdown}
                type="text"
                name="searchTxt"
                id="search"
                onChange={(e) => {
                  setUrl(e.target.value);
                  setShow(false);
                }}
                onKeyDown={check}
                autoFocus
              />
              <div className={styles.button}>{getArrow()}</div>
            </div>
            {show && getKooCode(url)}
          </div>
          <div className={styles.child2}>
            {show && getKooPreview(url)}
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Copyright
          <span className={styles.logo}>
            <img src="https://www.kooapp.com/img/logoKuSolidOutline.svg" alt="Koo Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}