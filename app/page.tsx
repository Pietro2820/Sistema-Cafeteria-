import { supabase } from '@/lib/supabase'

export default async function Home() {
  // Busca os produtos e o nome da categoria relacionada
  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('*, categorias(nome)')

  // Se der erro, mostra na tela
  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Erro ao carregar cardápio: {error.message}</div>
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid #6F4E37', paddingBottom: '10px' }}>☕ Cardápio da Cafeteria</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {produtos?.map((produto: any) => (
          <div key={produto.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#6F4E37' }}>{produto.nome}</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>{produto.descricao}</p>
            <p style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '15px' }}>
              R$ {produto.preco} 
              <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal', marginLeft: '10px' }}>
                ({produto.categorias?.nome})
              </span>
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}