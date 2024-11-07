interface UploadData {
    file: string
    filename: string
    filepath?: string
    commitmsg: string
    githubToken?: string
    githubUrl: string
}

const FILE_PATH = 'easy-editor'



export async function upload({ file, filepath = FILE_PATH, filename, commitmsg, githubToken, githubUrl }: UploadData) {
    // https://github.com/GitHubJiKe/screenshots
    const urlObj = new URL(githubUrl)
    const [_, REPO_OWNER, REPO_NAME] = urlObj.pathname.split('/')

    if (!REPO_OWNER || !REPO_NAME) {
        return 'fail'
    }
    // 配置
    // @ts-ignore
    const GITHUB_TOKEN = githubToken || window.localStorage.getItem('GITHUB_TOKEN');
    const UPLOAD_PATH = filepath ? `${filepath}/${filename}.md` : `${filename}.md`;
    const COMMIT_MESSAGE = commitmsg;

    // 读取文件并进行 Base64 编码
    const content = btoa(unescape(encodeURIComponent(file)))

    console.log(GITHUB_TOKEN, UPLOAD_PATH, content);
    // 构建请求 URL
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${UPLOAD_PATH}`;

    // 构建请求头
    const headers = {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
    };

    // 构建请求体
    const data = {
        'message': COMMIT_MESSAGE,
        'content': content
    };

    // 发送请求
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (response.status === 201) {
            return { status: 'success', message: 'upload success' }
        } else {
            const responseData = await response.json();
            return { status: 'fail', message: responseData.message };
        }
    } catch (error) {
        console.error('Error:', error);
        return { status: 'fail', message: (error as Error).message };
    }

}