import { CreditStatus, ICreditConsultationService, CreditAnalysis, Debt } from '../credit';

class TestCreditAnalysis {
    private mock: jest.Mocked<ICreditConsultationService>;

    private static readonly INVALID_CPF = "123A";
    private static readonly COMMUNICATION_ERROR_CPF = "76217486300";
    private static readonly NO_PENDING_CPF = "60487583752";
    private static readonly DUE_CPF = "82226651209";

    constructor() {
        this.mock = {
            ConsultPendingByCPF: jest.fn()
        };

        this.mock.ConsultPendingByCPF.mockReturnValueOnce(Promise.resolve(null)) 
        .mockReturnValueOnce(Promise.reject(new Error('Testing communication error'))) 
            .mockReturnValueOnce(Promise.resolve([])) 
            .mockReturnValueOnce(Promise.resolve([{ CPF: TestCreditAnalysis.DUE_CPF, PersonName: 'Test Client', ClaimantName: 'ACME Corp', DebtDescription: 'Unpaid installment', DebtAmount: 900.50 }])); // Due CPF
    }

    private getCreditStatus(cpf: string): Promise<CreditStatus> {
        const analysis = new CreditAnalysis(this.mock);
        return analysis.checkCreditStatus(cpf);
    }

    public testInvalidCPF() {
        return this.getCreditStatus(TestCreditAnalysis.INVALID_CPF).then(status => {
            expect(status).toBe(CreditStatus.InvalidParameter);
        });
    }

    public testCommunicationError() {
        return this.getCreditStatus(TestCreditAnalysis.COMMUNICATION_ERROR_CPF).then(status => {
            expect(status).toBe(CreditStatus.CommunicationError);
        });
    }

    public testNoPendingCPF() {
        return this.getCreditStatus(TestCreditAnalysis.NO_PENDING_CPF).then(status => {
            expect(status).toBe(CreditStatus.NoPending);
        });
    }

    public testDueCPF() {
        return this.getCreditStatus(TestCreditAnalysis.DUE_CPF).then(status => {
            expect(status).toBe(CreditStatus.Due);
        });
    }
}

describe('Test Credit Analysis', () => {
    const testCreditAnalysis = new TestCreditAnalysis();

    it('should return Invalid Parameter for an invalid CPF', () => {
        return testCreditAnalysis.testInvalidCPF();
    });

    it('should return Communication Error for a communication error CPF', () => {
        return testCreditAnalysis.testCommunicationError();
    });

    it('should return No Pending for a CPF with no pending debts', () => {
        return testCreditAnalysis.testNoPendingCPF();
    });

    it('should return Due for a CPF with pending debts', () => {
        return testCreditAnalysis.testDueCPF();
    });
});
