"use strict";
if (this["koo_emb"] === undefined) {
  const postAjax = (url, data, success) => {
    var params =
      typeof data == "string"
        ? data
        : Object.keys(data)
            .map(function (k) {
              return (
                encodeURIComponent(k) + "=" + encodeURIComponent(data[k])
              );
            })
            .join("&");
    var xhr = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState > 3 && xhr.status == 200) {
        success(xhr.responseText);
      }
    };
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    xhr.send(params);
    return xhr;
  }
  // script loaded successfully
  const backendUrl = "https://analytics.kooapp.com/events";
  const eventData = {
    eventName: 'ScriptLoad',
    eventType: 'script',
    location: window.location.href,
    referer: document.referrer,
    language: window.navigator.userLanguage || window.navigator.language,
    screenWidth: screen.width,
    screenHeight: screen.height
  };
  postAjax(backendUrl, eventData, function (data) {
    console.log(data);
  });

  var koo_emb = new Set();
  const kooMainClass = "koo-media";
  const script = "data-koo-permalink";
  const imageModelSection = "koo-embed-";
  const ID_PREFIX = "koo-media-payload-";
  const validOriginListArray = ["localhost", "embed.kooapp.com", "koo"];
  const key = "data-koo-payload-id";
  const moreCssClass =
    "\n  background-color: transparent;\n  box-shadow: none;\n  display: block;\n  margin: 0;\n  min-width: 326px;\n  padding: 0;\n";

  let kooCounter = 0;
  // sampleAdditonalParamInfo(function (something) {
  //   something
  // });
  function resolve(e, value, embedLink) {
    let kooId;
    try {kooId = embedLink.split("#")[0].split("?")[1].split("=")[1];} catch (error) {}
    e.className = e.className.replace(value, "");
    e.style.display = "none";

    // hide all other blockquote with same data-koo-permalink
    const allKooWithSameSrc = document.querySelectorAll(
      `[data-koo-permalink="${embedLink}"]`
    );
    allKooWithSameSrc.forEach((element) => {
      element.style.display = "none";
    });
    // script executed successfully

    eventData['eventName'] = 'ScriptExecute';
    eventData['kooId'] = kooId;
    postAjax(backendUrl, eventData, function (data) {
      console.log(data);
    });
  }

  const init2 = (el, selector) => {
    const id = kooCounter++;
    const value = imageModelSection + id;
    const options = {};
    if (!el.id) {
      el.id = ID_PREFIX + id;
    }
    let embed = selector;
    options.ci = id;
    // sampleAdditonalParamInfo(function(resp) {
    //   options.something = resp
    // })
    const additionalInfo = encodeURIComponent(JSON.stringify(options));

    // Koo with same id should only load once in a page.
    if (koo_emb.has(embed)) {
      return;
    }
    koo_emb.add(embed);

    const node = document.createElement("iframe");
    node.title = "koo-iframe";
    node.className = el.className;
    node.id = value;
    node.src = embed + "#" + additionalInfo;
    node.referrerPolicy = "unsafe-url";
    node.setAttribute("allowTransparency", "true");
    node.setAttribute("allowfullscreen", "true");
    const boundsString = el.style.position;
    if (boundsString) {
      node.setAttribute(attrName, boundsString);
    }
    node.setAttribute("frameBorder", "0");
    node.setAttribute("height", "0");
    node.setAttribute("width", "100%");
    node.setAttribute(key, el.id);
    node.setAttribute("scrolling", "no");
    node.setAttribute("style", el.style.cssText + ";" + moreCssClass);
    // node.style.position = "absolute";
    el.parentNode.insertBefore(node, el);
    resolve(el, kooMainClass, embed);
  };
  const attr = (elem) => {
    if (elem && elem.hasAttribute(script)) {
      return elem.getAttribute(script);
    }
    const latest_chapter = elem.getElementsByTagName("a");
    for (let i = latest_chapter.length - 1; i >= 0; i--) {
      const chapter = escape(latest_chapter[i].href);
      if (chapter) {
        return chapter;
      }
    }
    return null;
  };
  const getIframeNode = (e) => {
    const callsOrDirectives = document.getElementsByTagName("iframe");
    let str;
    for (let ii = callsOrDirectives.length - 1; ii >= 0; ii--) {
      const doc = callsOrDirectives[ii];
      if (doc.contentWindow === e.source) {
        str = doc;
        break;
      }
    }
    return str;
  };

  const start = (e) => {
    const isValidOrigin = validOriginListArray.some((el) =>
      e.origin.includes(el)
    );

    if (!isValidOrigin) {
      return;
    }
    const el = getIframeNode(e);
    if (!el) {
      return;
    }
    let v;
    try {
      v = JSON.parse(e.data);
    } catch (t) {}
    if (
      "object" != typeof v ||
      "string" != typeof v.type ||
      "object" != typeof v.details
    ) {
      return;
    }
    const { details: data, type: event } = v;
    if (event !== "koo_frame_loaded") {
      return;
    }

    var body = document.body,
      html = document.documentElement;
    var fallbackHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    el.height = (data.height && data.height) || fallbackHeight;
    el.style.maxHeight = (data && `${data.height}px`) || fallbackHeight;
    //   el.width = data.width; // if we want to toggle width then uncomment this.
  };

  const parse2 = () => {
    const keywordResults = document.getElementsByClassName(kooMainClass);
    for (let i = 0; i < keywordResults.length; i++) {
      const target = keywordResults[i];
      if ("BLOCKQUOTE" === target.tagName) {
        const last = attr(target);
        if (last) {
          init2(target, last);
        }
      }
    }
  };

  window.addEventListener("load", parse2);
  document.addEventListener("DOMContentLoaded", parse2);
  parse2();

  window.addEventListener("message", start);
}