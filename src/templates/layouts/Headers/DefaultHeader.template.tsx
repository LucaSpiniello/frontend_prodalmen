import { Link, useLocation } from 'react-router-dom';
import Header, { HeaderLeft, HeaderRight } from '../../../components/layouts/Header/Header';
import DefaultHeaderRightCommon from './_common/DefaultHeaderRight.common';
import SearchPartial from './_partial/Search.partial';
import SelectYear from './_partial/SelectYear';
import { IoMdArrowRoundBack } from "react-icons/io";


const DefaultHeaderTemplate = () => {
	const { state } = useLocation()

	return (
		<Header className='h-16'>
			<HeaderLeft>
				{/* <Link to={state?.pathname}>
					<div className='w-14 h-14 flex items-center justify-center'>
						<IoMdArrowRoundBack style={{ fontSize: 35 }} />
					</div>
				</Link> */}
				<SearchPartial />
			</HeaderLeft>
			<HeaderRight>
				<SelectYear />
				<DefaultHeaderRightCommon />
			</HeaderRight>
		</Header>
	);
};

export default DefaultHeaderTemplate;
