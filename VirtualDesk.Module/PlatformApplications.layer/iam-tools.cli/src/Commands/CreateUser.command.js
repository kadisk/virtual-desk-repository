const inquirer = require('inquirer').default
const MountIAMCommand = require('../Helpers/MountIAMCommand')

const CreateUserCommand = async ({ startupParams, params }) => {
    const IAMCommand = MountIAMCommand({ startupParams, params })

    console.log('\n👤 Criação de novo usuário\n')

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Nome do usuário:',
            validate: (input) => input.trim().length > 0 || 'O nome não pode ser vazio.'
        },
        {
            type: 'input',
            name: 'email',
            message: 'E-mail do usuário:',
            validate: (input) =>
                /\S+@\S+\.\S+/.test(input) || 'Digite um e-mail válido.'
        },
        {
            type: 'input',
            name: 'username',
            message: 'Username:',
            validate: (input) => input.trim().length > 0 || 'O Username não pode ser vazio.'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Senha do usuário:',
            mask: '*'
        }
    ])

    console.log('\n📋 Dados informados:')
    console.log(`   Nome: ${answers.name}`)
    console.log(`   Username: ${answers.username}`)
    console.log(`   E-mail: ${answers.email}`)
    console.log(`   Senha: ${'*'.repeat(answers.password.length)} (oculta)\n`)

    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Confirmar criação do usuário com os dados acima?',
            default: true
        }
    ])

    if (!confirm) {
        console.log('\n🚫 Operação cancelada pelo usuário.\n')
        return
    }

    console.log('\n🚀 Criando usuário...')

    const createdUser = await IAMCommand((API) =>
        API.CreateUser({
            name: answers.name,
            username: answers.username,
            email: answers.email,
            password: answers.password
        })
    )

    console.log('\n✅ Usuário criado com sucesso!')
    console.log(`   ID: ${createdUser.id}`)
    console.log(`   Nome: ${createdUser.name}`)
    console.log(`   E-mail: ${createdUser.email}\n`)
}

module.exports = CreateUserCommand
