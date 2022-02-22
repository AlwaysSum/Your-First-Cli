// @ts-nocheck
const clone = require('git-clone')
const shell = require('shelljs');
const log = require('tracer').colorConsole({
    format: `buluke=>{{message}}`
})
const fs = require('fs-extra');
const path = require('path');
//问答库
var inquirer = require('inquirer')

log.info('创建例子：buluke create  [my-project]')

//模板列表
const TemplateList = {
    EditorWeb: "[ ]编辑器工具模板 < react+antd+Umi+babylonjs >",
    Flutter: "[ ]移动端项目模板: < flutter >",
    Git: "[ ]从GIT获取模板"
}
const PWD_PATH = shell.pwd()
const TPL_PATH = path.resolve(__dirname, '../templates')

//拷贝模板到指定目录
async function copyTplDirs(tplName, targetDir) {
    const targetPath = targetDir && targetDir !== '.' ? `${PWD_PATH}/${targetDir}` : `${PWD_PATH}`
    log.info(`正在生成模板代码，生成位置：${PWD_PATH} ...`)
    //创建文件夹
    await fs.promises.access(targetPath)
        .catch(async err => await fs.promises.mkdir(targetPath, { recursive: true }));
    //复制文件
    fs.copy(`${TPL_PATH}/${tplName}`, targetPath, {
        filter: (src) => {
            //TODO 过滤非必要文件夹，处理一些特殊的文件
            return !new RegExp('/node_modules|.git/').test(src)
        }
    }).then(() => {
        log.info('**创建完成...**')
    })
}



//创建项目
module.exports = async function createProject(project) {
    //通过git拉取代码
    // clone(`https://github.com/cheneyweb/${tpl}.git`, pwd + `/${project}`, null, function () {
    //     shell.rm('-rf', pwd + `/${project}/.git`)
    //     log.info('项目创建完成！')
    // })
    //选择模板
    const answerTpl = await inquirer.prompt([{
        type: 'list',
        name: 'template',
        message: '选择创建模板:',
        choices: [TemplateList.EditorWeb, TemplateList.Flutter, TemplateList.Git]
    }])
    switch (answerTpl.template) {
        //内置编辑器模板
        case TemplateList.EditorWeb:
            copyTplDirs('tpl-editor-web', project)
            break
        //git创建模板    
        case TemplateList.Git:
            //选择模板
            inquirer.prompt([{
                type: 'input',
                name: 'gitUrl',
                message: '请输入git模板地址：',
            }]).then((answers) => {
                // log.info('结果为:' + answers.gitUrl) 
                if (answers.gitUrl) {
                    clone(answers.gitUrl, `${PWD_PATH}/${project}`, null, function () {
                        shell.rm('-rf', `${PWD_PATH}/${project}/.git`)
                        log.info('项目创建完成！')
                    })
                } else {
                    log.error('Git地址异常！')
                }
            })
            break
        default:
            log.warn('**模板开发中...**')
            break;
    }

}