import app from '../app'
import request from 'supertest'

describe('Express Test', () => {
  it('should index ok', async () => {
    const response = await request(app).get('/').send()

    expect(response.status).toBe(200)
  })
})
