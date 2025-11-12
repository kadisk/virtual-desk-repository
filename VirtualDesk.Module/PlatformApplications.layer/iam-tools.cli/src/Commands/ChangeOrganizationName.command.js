const inquirer = require('inquirer').default
const MountIAMCommand = require('../Helpers/MountIAMCommand')

const ChangeOrganizationNameCommand = async ({ args, startupParams, params }) => {
    const { organizationId } = args

    const IAMCommand = MountIAMCommand({ startupParams, params })
    const organization = await IAMCommand((API) => API.GetOrganization({ organizationId }))

    console.log(`\nOrganização atual:`)
    console.log(`   ID: ${organization.id}`)
    console.log(`   Nome atual: ${organization.name}\n`)

    const { confirmChange } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmChange',
            message: `Deseja alterar o nome da organização "${organization.name}"?`,
            default: false
        }
    ])

    if (!confirmChange) {
        console.log('\n🚫 Operação cancelada pelo usuário.\n')
        return
    }

    const { newName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'newName',
            message: 'Informe o novo nome da organização:',
            validate: (input) => input.trim().length > 0 || 'O nome não pode ser vazio.'
        }
    ])

    console.log(`\n🔄 Alterando nome da organização para: "${newName}" ...`)

    const updated = await IAMCommand((API) =>
        API.UpdateOrganizationName({ organizationId, name: newName })
    )

    console.log(`\n✅ Nome atualizado com sucesso!`)
    console.log(`   Novo nome: ${updated.name}\n`)
}

module.exports = ChangeOrganizationNameCommand
