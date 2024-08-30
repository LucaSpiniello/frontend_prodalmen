import { Link } from "react-router-dom";
import { NavItem, NavSeparator } from "../../../components/layouts/Navigation/Nav";
import User from "../../../components/layouts/User/User";
import { authPages } from "../../../config/pages.config";
import { useAuth } from "../../../context/authContext";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { RiAdminFill } from "react-icons/ri";
import { BiSolidMessageAltMinus } from "react-icons/bi";

const UserTemplate = () => {
	const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos?.groups)
	const { onLogout } = useAuth();
	// const cargoLabels = perfilData?.cargos.map(cargo => cargo.cargo_label) || []

	const positions = Object.values(userGroup || {});

	return (
		<User
			name={perfilData?.first_name!}
			nameSuffix={perfilData?.first_name ? '' : perfilData?.username}
			position={positions}
			//@ts-ignore
			src={perfilData?.image! ? perfilData.image! : ''}
		>
			<NavSeparator />
			{
				perfilData?.is_staff
					? <NavItem text='Admin' to={`${process.env.VITE_BASE_URL}/admin`} icon='HeroUser' />
					: null
			}
			<NavItem {...authPages.profilePage} />
			<NavItem text='Cerrar Sesión' icon='HeroArrowRightOnRectangle' onClick={() => onLogout()} />
		</User>
	);
};

export default UserTemplate;
