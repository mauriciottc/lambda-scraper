const axios = require('axios')
const htmlToJson = require('html-to-json')

const getCarteira = async ({
  cookie, url,
}) => {
  const dep = getCarteira.dependencies()
  const resultAxios = await dep.axios({
    method: 'get',
    url,
    headers: {
      cookie,
    },
  })

  const promise = htmlToJson.parse(resultAxios.data, function () {
    return this.map('#table_1 tr', ($item) => ({
      ticker: $item.find('.ticker span').text(),
      inicio: $item.find('td:nth-child(4)').text(),
      alocacao: $item.find('td:nth-child(5)').text(),
      preco: $item.find('td:nth-child(7)').text(),
      teto: $item.find('td:nth-child(8)').text(),
      status: $item.find('td:nth-child(10)').text(),
    }))
  })

  return promise
}

getCarteira.dependencies = () => ({
  axios,
  htmlToJson,
})

module.exports = {
  getCarteira,
}
