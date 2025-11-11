const MountIAMCommand = require('../Helpers/MountIAMCommand')
const Table = require('cli-table')

const ListOrganizationsCommand = async ({ startupParams, params }) => {
    const IAMCommand = MountIAMCommand({ startupParams, params })
    const organizations = await IAMCommand((API) => API.ListOrganizations())

    if (!organizations || organizations.length === 0) {
        console.log('\nNenhuma organização encontrada.\n')
        return
    }

    const table = new Table({
        head: ['ID', 'Nome', 'Status', 'Criada em', 'Atualizada em'],
        style: { head: ['green'] }
    })

    organizations.forEach(org => {
        table.push([
            org.id,
            org.name,
            org.status,
            org.createdAt,
            org.updatedAt
        ])
    })

    console.log('\nOrganizações Registradas:\n')
    console.log(table.toString())
    console.log('')
}

module.exports = ListOrganizationsCommand
