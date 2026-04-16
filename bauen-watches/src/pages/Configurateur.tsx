import Button from '../components/Button'

export default function Configurateur() {
  return (
    <section className="bg-base text-textMain min-h-screen py-32 text-center px-6">
      <h2 className="text-4xl font-serif mb-6 text-textMain">
        Configurateur de Montre
      </h2>
      <p className="max-w-xl mx-auto text-textSubtle mb-12 leading-relaxed">
        Créez la montre qui vous ressemble : choisissez le boîtier, le cadran,
        le bracelet et les finitions selon vos envies.
      </p>

      <Button variant="outline">Commencer la personnalisation</Button>
    </section>
  )
}
