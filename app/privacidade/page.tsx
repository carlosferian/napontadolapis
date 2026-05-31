import type { Metadata } from 'next'
import Link from 'next/link'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Política de Privacidade — A Ponta do Lápis',
  description: 'Política de privacidade do site A Ponta do Lápis e do aplicativo Dividir Conta — A Ponta do Lápis. Privacidade by design: sem coleta de dados pessoais.',
  alternates: { canonical: 'https://apontadolapis.com.br/privacidade' },
}

export default function PrivacidadePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <div className="calm-header" style={{ paddingBottom: 24, borderBottom: '1px solid var(--c-line)' }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          LEGAL · PRIVACIDADE
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--c-ink)', marginBottom: 8 }}>
          Política de Privacidade
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 14 }}>
          A Ponta do Lápis · Última atualização: 30 de maio de 2026
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Esta Política de Privacidade se aplica ao <strong style={{ color: 'var(--c-ink)' }}>site apontadolapis.com.br</strong> e ao <strong style={{ color: 'var(--c-ink)' }}>aplicativo Dividir Conta — A Ponta do Lápis</strong> (disponível para Android e iOS). Ambos compartilham os mesmos princípios de privacidade descritos abaixo.
        </p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Ao utilizar o site ou o aplicativo, você concorda com as práticas descritas nesta política.
        </p>
      </div>

      {/* Destaque: privacidade by design */}
      <div className="rounded-2xl border p-5 flex gap-4" style={{ background: 'var(--c-emerald-soft)', borderColor: 'rgba(16,185,129,0.2)' }}>
        <span className="text-2xl flex-shrink-0">🔒</span>
        <div>
          <p className="font-bold text-sm" style={{ color: 'var(--c-emerald)' }}>Privacidade by Design</p>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            Nem o site nem o aplicativo coletam, solicitam ou transmitem dados de identificação pessoal. Todos os cálculos e dados inseridos são processados inteiramente no seu dispositivo ou navegador.
          </p>
        </div>
      </div>

      {/* Seções */}
      <div className="space-y-6">

        <Section n="1" title="Coleta e Uso de Informações">
          <p>O aplicativo e o site foram desenvolvidos com o conceito de foco total na privacidade <em>(privacy by design)</em>.</p>
          <ul>
            <li><strong>Sem coleta de dados pessoais:</strong> Não coletamos, não solicitamos e não transmitimos dados de identificação pessoal — como nome completo, CPF, e-mail, número de telefone ou localização geográfica.</li>
            <li><strong>Processamento e armazenamento local (aplicativo):</strong> Todos os dados inseridos no aplicativo — como nomes dos participantes, itens consumidos, valores e histórico de divisões — são processados e armazenados exclusivamente no armazenamento seguro do seu dispositivo. Nenhum dado é enviado para servidores externos.</li>
            <li><strong>Processamento no navegador (site):</strong> Todos os cálculos realizados no site rodam diretamente no seu navegador (client-side). Nenhum dado financeiro inserido nas calculadoras é enviado para servidores.</li>
          </ul>
        </Section>

        <Section n="2" title="Permissões do Dispositivo">
          <p>Para funcionar de maneira simples e eficiente, o aplicativo requer o mínimo de permissões possível.</p>
          <ul>
            <li>O aplicativo <strong>não solicita</strong> acesso aos seus contatos, câmera, fotos ou arquivos confidenciais do sistema operacional.</li>
            <li>Recursos de compartilhamento (como gerar o resumo da conta para WhatsApp ou outros apps) utilizam o <strong>compartilhamento nativo</strong> do Android e iOS — você tem controle total sobre para qual aplicativo deseja enviar o texto gerado.</li>
          </ul>
        </Section>

        <Section n="3" title="Serviços de Terceiros e Links Externos">
          <ul>
            <li>O aplicativo pode conter links direcionando para o nosso site oficial (<strong>apontadolapis.com.br</strong>), onde oferecemos outras calculadoras financeiras gratuitas.</li>
            <li>A navegação no site externo é regida por esta mesma política. O site utiliza cookies padrão de navegação (Google Analytics) para melhorar a experiência do usuário.</li>
            <li>O aplicativo em si <strong>não utiliza SDKs de terceiros</strong> para rastrear suas atividades fora do app.</li>
          </ul>
        </Section>

        <Section n="4" title="Segurança dos Dados">
          <p>Como todos os dados gerados pelo aplicativo permanecem estritamente no seu celular, a segurança deles depende da proteção do seu próprio dispositivo. Recomendamos o uso de senhas ou biometria para proteger suas informações contra acessos não autorizados.</p>
          <p>Se você desinstalar o aplicativo ou limpar seus dados nas configurações do Android ou iOS, todo o histórico de contas divididas será excluído permanentemente do dispositivo de forma automática.</p>
        </Section>

        <Section n="5" title="Conformidade com a LGPD">
          <p>Como o aplicativo não realiza o tratamento, coleta ou transferência de dados pessoais para servidores externos, ele está integralmente alinhado às diretrizes da <strong>LGPD (Lei nº 13.709/2018)</strong>, garantindo que você possua a propriedade e o controle absoluto sobre as informações inseridas.</p>
        </Section>

        <Section n="6" title="Alterações nesta Política">
          <p>Podemos atualizar esta Política de Privacidade de tempos em tempos para refletir melhorias no aplicativo ou mudanças regulatórias. Recomendamos que você revise esta página periodicamente. Quaisquer alterações entram em vigor imediatamente após a publicação.</p>
        </Section>

        <Section n="7" title="Contato">
          <p>Se você tiver alguma dúvida ou sugestão sobre nossa Política de Privacidade, não hesite em entrar em contato:</p>
          <p>
            📧 <a href="mailto:quaseiso@gmail.com" style={{ color: 'var(--c-emerald)' }}>quaseiso@gmail.com</a>
          </p>
        </Section>

      </div>

      {/* Link de volta */}
      <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--c-line)' }}>
        <Link href="/" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-muted)' }}>
          ← Voltar ao site
        </Link>
        <Link href="/dividir" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-emerald)' }}>
          Calculadora Dividir Conta →
        </Link>
      </div>

    </div>
  )
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-black flex items-center gap-2" style={{ color: 'var(--c-ink)' }}>
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black flex-shrink-0"
          style={{ background: 'var(--c-emerald-soft)', color: 'var(--c-emerald)' }}
        >
          {n}
        </span>
        {title}
      </h2>
      <div className="text-sm leading-relaxed space-y-2 pl-8" style={{ color: 'var(--c-muted)' }}>
        {children}
      </div>
    </div>
  )
}
