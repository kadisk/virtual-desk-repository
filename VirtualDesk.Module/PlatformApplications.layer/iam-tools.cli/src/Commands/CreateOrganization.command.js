const colors = require('colors')
const MountIAMCommand = require('../Helpers/MountIAMCommand')

const CreateOrganizationCommand = async ({ args, startupParams, params }) => {

    const { name } = args
    const IAMCommand = MountIAMCommand({ startupParams, params })
    const organization = await IAMCommand((API) => API.CreateOrganization({ name }))

    const { id, status, createdAt, updatedAt } = organization

    console.log(`\n${colors.green('Organização criada com sucesso!')}\n`)
    console.log(`${colors.bold('ID:')}          ${id}`)
    console.log(`${colors.bold('Nome:')}        ${name}`)
    console.log(`${colors.bold('Status:')}      ${status}`)
    console.log(`${colors.bold('Criada em:')}   ${createdAt}`)
    console.log(`${colors.bold('Atualizada:')}  ${updatedAt}\n`)
}

module.exports = CreateOrganizationCommand
