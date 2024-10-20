class EasyEditor {
    constructor() {
        this.create();
    }
    editor!: HTMLTextAreaElement;
    previewPane!: HTMLDivElement;
    private create() {
        this.editor = document.createElement("textarea");
        this.editor.id = "easyEditor";
        this.editor.classList.add("easy-editor");
        this.editor.classList.add("noto-serif-sc-easy-editor");
        this.editor.classList.add("markdown-body");
    }

    setContent(content: string) {
        this.editor.innerHTML = content;
    }

    content() {
        return this.editor.value;
    }

    html() {
        return this.editor;
    }

    preview() {
        this.editor.classList.add("hidden");
        this.previewPane = document.createElement("div");

        this.previewPane.classList.add("preview-editor");
        this.previewPane.classList.add("markdown-body");
        this.previewPane.classList.add("preview-editor-view");

        this.previewPane.innerHTML = this.renderContent();
        const editor = document.querySelector(`#${this.editor.id}`)!;
        editor.parentElement?.append(this.previewPane);
    }

    unPreview() {
        this.editor.classList.remove("hidden");
        this.previewPane.remove();
    }

    private renderContent() {
        console.log(this.content().trim());
        // @ts-ignore
        return marked.parse(this.content().trim());
    }
}

export default EasyEditor;
