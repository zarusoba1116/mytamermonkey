// ==UserScript==
// @name         Conditional Hide YouTube Rich Grid Renderer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Hide ytd-rich-grid-renderer on YouTube except channel tabs during specified hours
// @author       Kensei
// @match        *://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 実行する時間の範囲を設定（24時間形式）
    const startHour = 14; // 実行開始時間 (例: 09:00)
    const endHour = 21;  // 実行終了時間 (例: 17:00)

    // ytd-rich-grid-rendererを非表示にする関数
    function toggleRichGridRenderer() {
        const richGridRenderers = document.querySelectorAll('ytd-rich-grid-renderer');

        // 現在のURLを取得
        const currentUrl = window.location.href;

        // チャンネルタブのURLのパターンを確認
        const isChannelTab = currentUrl.includes('/@') && currentUrl.includes('/videos');

        // 現在の時間を取得
        const now = new Date();
        const currentHour = now.getHours();

        // 時間帯のチェック
        const isWithinTimeRange = currentHour >= startHour && currentHour < endHour;

        richGridRenderers.forEach(renderer => {
            if (isChannelTab || isWithinTimeRange) {
                // チャンネルタブまたは指定時間内では表示
                renderer.style.display = 'block';
            } else {
                // その他のページでは非表示
                renderer.style.display = 'none';
            }
        });
    }

    // 初回読み込み時に実行
    window.addEventListener('load', toggleRichGridRenderer);

    // MutationObserverを使って新しい要素の追加を監視
    const observer = new MutationObserver(toggleRichGridRenderer);
    observer.observe(document.body, { childList: true, subtree: true });

    // ページ遷移やタブ切り替えのイベントリスナー
    window.addEventListener('popstate', toggleRichGridRenderer);

    // YouTubeのページが動的に変更されたときのイベントを監視 (重要)
    document.addEventListener('yt-navigate-finish', toggleRichGridRenderer);

    // YouTubeのページナビゲーションを監視してURL変更を検知
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            toggleRichGridRenderer();
        }
    }).observe(document, { subtree: true, childList: true });

})();
