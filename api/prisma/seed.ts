import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const categoriesPT = ["Promoção", "Sazonal", "Datas Comemorativas", "Lançamento de Produto", "Desconto", "Programa de Fidelidade", "Email Marketing", "Redes Sociais", "Conscientização de Marca", "Edição Limitada"]

    for (const category of categoriesPT) {
        await prisma.category.create({
            data: { name: category }
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })