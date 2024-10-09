// ==UserScript==
// @name         SNS Blocker
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Confirm access to SNS with a custom button
// @match        https://x.com/*
// @match        https://www.youtube.com/*
// @match        https://www.instagram.com/*
// @grant        none
// @author       kensei
// ==/UserScript==

(function() {
    'use strict';

    // フェードインの時間（ミリ秒）
    const fadeInDuration = 5000; // 5秒

    // カスタムダイアログを作成する関数
    const createDialog = () => {
        // 背景を真っ黒にする
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 1)'; // 半透明の黒
        overlay.style.zIndex = '9998';
        document.body.appendChild(overlay);

        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.zIndex = '9999';
        dialog.style.borderRadius = '10px'; // 角を丸くする
        dialog.innerHTML = `
            <p style="text-align: center; font-size: 18px; color: white; margin: 18px;">本当に開きたいですか？</p>
            <div style="display: flex; justify-content: center; gap: 10px;">
                <button id="noButton" style="background-color: #1DA1F2; color: white; border: none; padding: 10px 50px; border-radius: 50px; cursor: pointer; opacity: 0; pointer-events: none;">NO</button>
                <button id="yesButton" style="background-color: #FF3C30; color: white; border: none; padding: 10px 20px; border-radius: 50px; cursor: pointer; opacity: 0; pointer-events: none;">YES</button>
            </div>
        `;

        document.body.appendChild(dialog);

        // YESボタンのクリックイベント
        const yesButton = document.getElementById('yesButton');
        yesButton.onclick = () => {
            overlay.remove(); // オーバーレイを削除
            dialog.remove();  // ダイアログを削除
        };

        // NOボタンのクリックイベント
        const noButton = document.getElementById('noButton');
        noButton.onclick = () => {
            window.location.href = "https://www.google.com"; // デフォルトの検索ページにリダイレクト
        };

        // YESボタンとNOボタンをフェードインさせる
        setTimeout(() => {
            // ボタンのフェードイン効果を設定
            yesButton.style.transition = `opacity ${fadeInDuration}ms`;
            noButton.style.transition = `opacity ${fadeInDuration}ms`;

            // 完全に表示
            yesButton.style.opacity = '1';
            noButton.style.opacity = '1';

            // フェードイン後にクリック可能にする
            setTimeout(() => {
                yesButton.style.pointerEvents = 'auto'; // YESボタンをクリック可能にする
                noButton.style.pointerEvents = 'auto'; // NOボタンをクリック可能にする
            }, fadeInDuration); // フェードインが完了した後
        },1000); // 1秒後に実行
    };

    // ページが読み込まれた後にダイアログを表示
    window.onload = createDialog;
})();
