#!/usr/bin/env node
// @ts-nocheck
// 第一行命令代表该文件在node环境下运行

const program = require('commander')
const createProject = require('./create-project')
// 声明版本信息
program
    .version('1.0.0')
    .description('buluke 脚手架~')

//声明命令
program.command('create  [project]')
    .action((project) => createProject(project))

program.addHelpText('after', `
    Example call:
    $ create [project] 项目名：非必填
`);

//执行解析
program.parse(process.argv);

