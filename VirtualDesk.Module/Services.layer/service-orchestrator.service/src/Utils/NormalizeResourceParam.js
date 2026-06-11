/**
 * Normaliza uma entrada de storageParams/socketParams.
 *
 * Formato owner (cria o recurso):
 *   "parameter": { "namespace": "...", "filename": "...", "owner": true }
 *
 * Formato não-owner (apenas referencia um recurso existente pelo namespace):
 *   "parameter": "namespace"
 *
 * @param {string} parameter chave do parâmetro
 * @param {string|object} value valor do parâmetro (string = namespace; objeto = config)
 * @returns {{ parameter: string, namespace: string, filename: (string|undefined), owner: boolean }}
 */
const NormalizeResourceParam = (parameter, value) => {
    if (typeof value === "string") {
        return { parameter, namespace: value, filename: undefined, owner: false }
    }

    return {
        parameter,
        namespace: value?.namespace,
        filename : value?.filename,
        owner    : value?.owner === true
    }
}

module.exports = NormalizeResourceParam
