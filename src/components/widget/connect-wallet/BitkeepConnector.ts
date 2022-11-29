import { AbstractConnector } from '@web3-react/abstract-connector';
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types';

class BitkeepConnector extends AbstractConnector {
    getProvider(): Promise<any> {
        throw new Error('Method not implemented.');
    }

    getAccount(): Promise<string | null> {
        throw new Error('Method not implemented.');
    }

    constructor(kwargs: AbstractConnectorArguments | undefined) {
        super(kwargs);
        this.handleChainChanged = this.handleChainChanged.bind(this);
        this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    activate = async (): Promise<ConnectorUpdate<string | number>> => {
        if (!window.bitkeep) {
            throw new NoEthereumProviderError();
        }
        const provider = (window.bitkeep.ethereum as any);
        if (!provider) {
            return window.open('https://bitkeep.com/download?type=0&theme=light') as any
        }
        if (provider.on) {
            provider.on('chainChanged', this.handleChainChanged);
            provider.on('accountsChanged', this.handleAccountsChanged);
            provider.on('close', this.handleClose);
        }

        let accounts = await provider.request({ method: 'eth_requestAccounts' });
        return { provider, account: accounts[0] };

    }

    deactivate = async () => {
        if (window.bitkeep.ethereum) {
            const provider = window.bitkeep.ethereum;
            provider.removeListener('chainChanged', this.handleChainChanged);
            provider.removeListener('accountsChanged', this.handleAccountsChanged);
            provider.removeListener('close', this.handleClose);
        }
    }

    getChainId = async () => {
        if (!window.bitkeep.ethereum) {
            throw new NoEthereumProviderError();
        }
        const provider = window.bitkeep.ethereum;
        return await provider.request({ method: 'eth_chainId' });
    }

    handleChainChanged = (chainId: any) => {
        this.emitUpdate({ chainId, provider: window.bitkeep });
    }

    handleAccountsChanged = (accounts: any) => {
        if (accounts.length === 0) {
            this.emitDeactivate();
        } else {
            this.emitUpdate({ account: accounts[0] });
        }
    }

    handleClose = (code: any, reason: any) => {
        this.emitDeactivate();
    }
}

export default BitkeepConnector;
