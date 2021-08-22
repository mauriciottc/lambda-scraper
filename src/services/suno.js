const axios = require('axios')
const htmlToJson = require('html-to-json')

const models = {
  ticker: {
    dividendos: '.ticker span',
    fiis: 'td:nth-child(2)',
    valor: '.ticker span',
  },
  preco: {
    dividendos: 'td:nth-child(7)',
    fiis: 'td:nth-child(8)',
    valor: 'td:nth-child(7)',
  },
  teto: {
    dividendos: 'td:nth-child(8)',
    fiis: 'td:nth-child(9)',
    valor: 'td:nth-child(8)',
  },
  status: {
    dividendos: 'td:nth-child(10)',
    fiis: 'td:nth-child(11)',
    valor: 'td:nth-child(10)',
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
      ticker: $item.find(models.ticker[report_id]).text(),
      inicio: $item.find('td:nth-child(4)').text(),
      alocacao: $item.find('td:nth-child(5)').text(),
      preco: $item.find(models.preco[report_id]).text(),
      teto: $item.find(models.teto[report_id]).text(),
      status: $item.find(models.status[report_id]).text(),
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
