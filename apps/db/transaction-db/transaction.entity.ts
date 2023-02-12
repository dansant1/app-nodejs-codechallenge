import { 
    Column, 
    Entity, 
    PrimaryColumn 
} from 'typeorm';

@Entity({ name: 'transaction' })
export class Transaction {
    @PrimaryColumn({ 
        name: 'id' 
    })
    id: number;

    @Column({ 
        name: 'transaction_external_id', 
        nullable: false, 
    })
    transactionExternalId: string;

    @Column({ 
        name: 'transaction_value', 
        nullable: false 
    })
    value: number;

    @Column({ 
        name: 'account_external_debit_id', 
        nullable: false 
    })
    accountExternalIdDebit: string;

    @Column({ 
        name: 'account_external_credit_id', 
        nullable: false 
    })
    accountExternalIdCredit: string;

    @Column({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({ 
        name: 'updated_at', 
        nullable: true, 
        type: 'timestamptz'
    })
    updatedAt?: Date;

    @Column({ 
        name: 'transaction_status_id', 
        nullable: false 
    })
    transactionStatusId: number;

    @Column({ 
        name: 'transaction_type_id', 
        nullable: false 
    })
    transactionTypeId: number;
}