import { Client } from '@elastic/elasticsearch'; 
const client = new Client({ node: 'http://localhost:9200' });

// Kullanıcı verilerini indexleyen bir fonksiyon
async function indexUser(user) {
  await client.index({
    index: 'users', // Endeks adı
    body: user
  });
}

// Arama fonksiyonu
async function searchUser(username) {
  const { body } = await client.search({
    index: 'users',
    body: {
      query: {
        match_phrase_prefix: { username } // username ile prefix araması yapılıyor
      }
    }
  });
  return body.hits.hits.map(hit => hit._source); // Sadece kullanıcı verilerini döndür
}

export { indexUser, searchUser };
