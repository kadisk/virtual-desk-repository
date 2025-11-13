const MountIAMCommand = require('../Helpers/MountIAMCommand')
const Table = require('cli-table')

const ListUsersCommand = async ({ startupParams, params }) => {
    const IAMCommand = MountIAMCommand({ startupParams, params })
    const users = await IAMCommand((API) => API.ListUsers())

    if (!users || users.length === 0) {
        console.log('\nNenhuma usuário encontrada.\n')
        return
    }

    const table = new Table({
        head: ['ID', 'Username', 'Nome', "E-mail", 'Status', 'Última atualização'],
        style: { head: ['green'] }
    })

    users.forEach(org => {
        table.push([
            org.id,
            org.username,
            org.name,
            org.email  ,
            org.status,
            org.updatedAt
        ])
    })

    console.log('\nOrganizações Registradas:\n')
    console.log(table.toString())
    console.log('')
}

module.exports = ListUsersCommand
