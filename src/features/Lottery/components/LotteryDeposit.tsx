import { copy, metamask } from '@assets/icons';
import CopyComponent from '@components/elements/CopyComponent';
import DropdownModal, {
  SelectedProps,
} from '@components/elements/DropdownModal';
import IconBadge from '@components/elements/IconBadge';
import TextField from '@components/elements/TextField';
import { T } from 'react-translator-component';

interface DepositProps {
  balance: number;
  fromText: string;
  selectedCurrency: SelectedProps;
  setSelectedCurrency?: React.Dispatch<React.SetStateAction<string>> | any;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue?: string | number;
  handleMax?: () => void;
}

const Deposit: React.FC<DepositProps> = ({
  balance,
  fromText,
  selectedCurrency,
  setSelectedCurrency,
  handleInputChange,
  inputValue,
  handleMax,
}) => {
  return (
    <section className="bg-neutral-black-500 p-4 text-white rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <small className="text-neutral-black-0 text-xs">{fromText}</small>
        </div>
        <div>
          <small className="text-neutral-black-0 text-xs">
            Balance: {balance}
          </small>
        </div>
      </div>
      <div className="flex items-center lg:flex-row flex-col lg:justify-between my-2">
        <div className="w-full">
          <DropdownModal
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            disabled={true}
          />
        </div>
        <div>
          <TextField
            placeholder="0.00"
            className="bg-tifi-dark mr-[-2] lg:w-[300px]"
            inputClass="text-3xl text-white lg:text-right"
            onChange={handleInputChange}
            value={inputValue}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CopyComponent
            copyText={selectedCurrency?.address}
            copyBody={<IconBadge icon={copy} />}
          />
          <div>
            <img src={metamask} alt="meta icon" />
          </div>
        </div>
        <div
          onClick={handleMax}
          className="hover:cursor-pointer border border-primary rounded-lg px-1"
        >
          <small className="text-xs">{T('Max')}</small>
        </div>
      </div>
    </section>
  );
};

export default Deposit;
