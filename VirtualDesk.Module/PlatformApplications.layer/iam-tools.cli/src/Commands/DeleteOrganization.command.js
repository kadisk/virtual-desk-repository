const inquirer = require('inquirer').default
const MountIAMCommand = require('../Helpers/MountIAMCommand')

const DeleteOrganizationCommand = async ({ args, startupParams, params }) => {
    const { organizationId } = args

    const IAMCommand = MountIAMCommand({ startupParams, params })
    const organization = await IAMCommand((API) => API.GetOrganization({ organizationId }))

    console.log(`\n   Organização selecionada:`)
    console.log(`   ID: ${organization.id}`)
    console.log(`   Nome: ${organization.name}\n`)

    console.log(`⚠️  Atenção: esta ação irá remover permanentemente o registro da organização.`)
    console.log(`   Essa operação não poderá ser desfeita!\n`)

    const { confirmDelete } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmDelete',
            message: `Deseja realmente excluir a organização "${organization.name}" (ID: ${organization.id})?`,
            default: false
        }
    ])

    if (!confirmDelete) {
        console.log('\n🚫 Operação cancelada pelo usuário.\n')
        return
    }

    console.log(`\n🗑️  Excluindo organização "${organization.name}"...`)

    await IAMCommand((API) => API.DeleteOrganization({ organizationId }))

    console.log(`\n✅ Organização excluída com sucesso!\n`)
}

module.exports = DeleteOrganizationCommand
