export enum CreditStatus {
    InvalidParameter = 'Invalid Parameter',
    CommunicationError = 'Communication Error',
    NoPending = 'No Pending',
    Due = 'Due'
}

export interface ICreditConsultationService {
    ConsultPendingByCPF(cpf: string): Promise<Debt[] | null>;
}

export interface Debt {
    CPF: string;
    PersonName: string;
    ClaimantName: string;
    DebtDescription: string;
    DebtAmount: number;
}

export class CreditAnalysis {
    private creditConsultationService: ICreditConsultationService;

    constructor(creditConsultationService: ICreditConsultationService) {
        this.creditConsultationService = creditConsultationService;
    }

    async checkCreditStatus(cpf: string): Promise<CreditStatus> {
        try {
            const debts = await this.creditConsultationService.ConsultPendingByCPF(cpf);

            if (!debts) {
                return CreditStatus.InvalidParameter;
            }

            if (debts instanceof Error) {
                return CreditStatus.CommunicationError;
            }

            return debts.length === 0
                ? CreditStatus.NoPending
                : CreditStatus.Due;
        } catch (error) {
            return CreditStatus.CommunicationError;
        }
    }
}
