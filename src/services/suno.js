const axios = require('axios')
const htmlToJson = require('html-to-json')

const models = {
  dividendos: {
    ticker: '.ticker span',
    preco: 'td:nth-child(8)',
    teto: 'td:nth-child(9)',
    status: 'td:nth-child(11)',
  },
  fiis: {
    ticker: 'td:nth-child(2)',
    preco: 'td:nth-child(8)',
    teto: 'td:nth-child(9)',
    status: 'td:nth-child(11)',
  },
  valor: {
    ticker: '.ticker span',
    preco: 'td:nth-child(7)',
    teto: 'td:nth-child(8)',
    status: 'td:nth-child(10)',
  },
}

const getHtml = async ({
  cookie, url, report_id,
}) => {
  const dep = getHtml.dependencies()
  const resultAxios = await dep.axios({
    method: 'get',
    url,
    headers: {
      cookie,
    },
  })

  const promise = htmlToJson.parse(resultAxios.data, function () {
    return this.map('#table_1 tr', ($item) => ({
      ticker: $item.find(models[report_id].ticker).text(),
      inicio: $item.find('td:nth-child(4)').text(),
      alocacao: $item.find('td:nth-child(5)').text(),
      preco: $item.find(models[report_id].preco).text(),
      teto: $item.find(models[report_id].teto).text(),
      status: $item.find(models[report_id].status).text(),
    }))
  })

  return promise
}

getHtml.dependencies = () => ({
  axios,
  htmlToJson,
})

module.exports = {
  getHtml,
}
