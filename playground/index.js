const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')
const path = require('path')

const mockData = () => ({
  title: 'any_title',
  description: 'any_description',
  photos: ['test_img-1_post', 'test_img-2_post'],
  price: 999999,
  fipePrice: 111111,
  brand: 'any_brand',
  model: 'any_model',
  year: 'any_year',
  color: 'any_color',
  doors: 4,
  steering: 'any_steering',
  fuel: 'any_fuel',
  kmTraveled: 100000,
  carItems: [
    'airbag',
    'alarme',
    'ar quente',
    'teto solar'
  ],
  licensePlate: 'any_license',
  fastSale: true
})

const dir = '.'
const createFile = () => {
  const fileName = 'img-post_test.png'
  const path = `${dir}/${fileName}`
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)
  fs.openSync(path, 'w')
  fs.writeFileSync(path, 'Olá mundo!')
  return fs.readFileSync(path)
}

const configParams = () => {
  const data = mockData()
  const files = createFile()
  console.log(files)
  data.photos = [files]
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))

  for (const file of files) {
    const stat = fs.lstatSync(path.join(dir, file))
    console.log(stat)
  }
  return formData
}

axios.request({
  url: 'http://localhost:5050/api/post',
  method: 'POST',
  data: configParams(),
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}).then((res) => {
  console.log(res.data)
}).catch(error => console.error(error.message))
