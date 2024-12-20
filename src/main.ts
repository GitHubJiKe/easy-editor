import EasyEditor from "./easy-editor";
import tippy from "tippy.js";
import * as htmlToImage from "html-to-image";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { defaultContent } from "./default-content";
import "./style.css";
import "./github.markdown.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/material.css";
import { upload } from "./upload";

const editor = new EasyEditor();

editor.setContent(defaultContent);

document.querySelector<HTMLDivElement>("#main")!.append(editor.html());

const previewBtn = document.querySelector("#previewBtn");
const shareBtn = document.querySelector("#shareBtn");

previewBtn?.addEventListener("click", () => {
    if (previewBtn.innerHTML.includes("Preview")) {
        editor.preview();
        previewBtn.innerHTML = "Back";
    } else {
        editor.unPreview();
        previewBtn.innerHTML = "Preview";
    }
    shareBtn?.classList.toggle("hidden");
});

tippy(shareBtn!, {
    allowHTML: true,
    content: `<div id="menu">
      <button id="png">Download PNG</button>
      <button id="pdf">Download PDF</button>
      <button id="github">2Github</button>
    </div>`,
    onShown(instance) {
        const menu = (document.querySelector("#menu") as HTMLDivElement)!;
        const eventHandle = (e: MouseEvent) => {
            instance.hide();
            menu.removeEventListener("click", eventHandle);
            // @ts-ignore
            switch (e.target?.id as string) {
                case "png":
                    htmlToImage
                        .toPng(editor.previewPane)
                        .then(function (dataUrl: string) {
                            const filename = prompt(
                                "type in filename",
                                "easy-editor",
                            );

                            if (!filename) {
                                return;
                            }
                            // @ts-ignore
                            download(dataUrl, filename + ".png");
                        })
                        .catch(function (error: Error) {
                            console.error("oops, something went wrong!", error);
                        });
                    break;

                case "pdf":
                    editor.previewPane.classList.remove("preview-editor-view");
                    const filename = prompt("type in filename", "easy-editor");
                    if (!filename) {
                        return editor.previewPane.classList.add(
                            "preview-editor-view",
                        );
                    }
                    const opt = {
                        margin: 1,
                        filename: filename + ".pdf",
                        image: { type: "jpeg", quality: 1 },
                        html2canvas: {
                            scale: 4,
                            useCORS: true,
                            allowTaint: true,
                        },
                        jsPDF: {
                            unit: "mm",
                            format: "a4",
                            orientation: "portrait",
                            floatPrecision: "smart",
                        },
                        enableLinks: true,
                    };

                    html2pdf().set(opt).from(editor.previewPane).save();
                    setTimeout(() => {
                        editor.previewPane.classList.add("preview-editor-view");
                    }, 1000);
                    break;
                case "github":
                    const content = editor.content()
                    const title = content.slice(0, 10)
                    upload({
                        file: content,
                        filename: new Date().toLocaleDateString() + "_" + Date.now(),
                        commitmsg: title,
                        githubUrl: "https://github.com/GitHubJiKe/screenshots",
                    }).then(() => {
                        alert("上传成功")
                    }).catch(function (error: Error) {
                        console.error("oops, something went wrong!", error);
                    })
                    break;
                default:
                    break;
            }
        };
        menu.addEventListener("click", eventHandle);
    },
    interactive: true,
    placement: "auto",
    theme: "light",
});
