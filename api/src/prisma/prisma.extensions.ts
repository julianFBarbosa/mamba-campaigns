import { Prisma } from "@prisma/client";

//extension for soft delete
export const softDelete = Prisma.defineExtension({
    name: 'softDelete',
    model: {
        $allModels: {
            async delete<M, A>(
                this: M,
                where: Prisma.Args<M, 'delete'>['where'],
            ): Promise<Prisma.Result<M, A, 'update'>> {
                const context = Prisma.getExtensionContext(this);
                console.log('context', context);

                return (context as any).update({
                    where,
                    data: {
                        deletedAt: new Date(),
                    },
                });
            },
        },
    },
    query: {
        $allModels: {
            async $allOperations({ model, operation, args, query }) {
                console.log('model', model);
                return query(args);
            },
        },
    },
});
