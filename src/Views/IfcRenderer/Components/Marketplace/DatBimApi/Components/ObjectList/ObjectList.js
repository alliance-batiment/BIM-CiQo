import { useEffect, useState } from 'react';
import axios from 'axios'
import {
	Grid,
	Card,
	CardContent,
	Button
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import Loader from '../../../../../../../Components/Loader';
import SearchBar from '../../../../../../../Components/SearchBar/SearchBar.jsx'

const ObjectList = ({ classes, openProperties, handleNext, typeProperties, selectedPortal }) => {
	const [searchInput, setSearchInput] = useState('');
	const [objects, setObjects] = useState([]);
	const [objectListDefault, setObjectListDefault] = useState([]);
	const [objectsLoader, setObjectsLoader] = useState(false);

	useEffect(() => {
		setObjectsLoader(true);
		async function getObjectsOfSelectedObject() {
			const classes = await axios.get(`${process.env.REACT_APP_API_DATBIM}/api/classes/mapping/${typeProperties}`, {
				headers: {
					'X-Auth-Token': sessionStorage.getItem('token')
				}
			})

			Promise.all(classes.data.properties.map(async (classProperty) => {
				return await axios.get(`${process.env.REACT_APP_API_DATBIM}/api/portals/${selectedPortal}/objects/${classProperty.class_reference_id}`, {
					headers: {
						'X-Auth-Token': sessionStorage.getItem('token')
					}
				});
			})).then(function (values) {
				const objects = values.reduce((acc, value) => {
					if (value.data.properties) {
						return acc.concat(value.data.properties);
					}

					return acc;
				}, [])
				setObjectListDefault(objects);
				setObjects(objects);
				setObjectsLoader(false);
			});
		}
		getObjectsOfSelectedObject();
	}, [])

	async function getObjects(typeProperties, selectedPage) {
		const classes = await axios.get(`${process.env.REACT_APP_API_DATBIM}/api/classes/mapping/${typeProperties}`, {
			headers: {
				'X-Auth-Token': sessionStorage.getItem('token')
			}
		})

		Promise.all(classes.data.properties.map(async (classProperty) => {
			return await axios.get(`${process.env.REACT_APP_API_DATBIM}/api/portals/${selectedPortal}/objects/${classProperty.class_reference_id}`, {
				headers: {
					'X-Auth-Token': sessionStorage.getItem('token')
				}
			});
		})).then(function (values) {
			const objects = values.reduce((acc, value) => {
				if (value.data.properties) {
					return acc.concat(value.data.properties);
				}

				return acc;
			}, [])
			setObjectListDefault(objects);
			setObjects(objects);
			setObjectsLoader(false);
		});
	}

	function searchObject(input) {
		if (objectListDefault && objectListDefault.length > 0) {
			const filtered = objectListDefault.filter(object => {
				const searchByObjectName = object.object_name.toLowerCase().includes(input.toLowerCase())
				const searchByOrganizationName = object.organization_name.toLowerCase().includes(input.toLowerCase());

				if (searchByObjectName) {
					return searchByObjectName;
				} else if (searchByOrganizationName) {
					return searchByOrganizationName;
				}
			})
			setSearchInput(input);
			setObjects(filtered);
		}
	}


	async function getObjectByKeyWord() {
		setObjectsLoader(true);

		try {
			const objectsList = await axios({
				method: 'get',
				url: `${process.env.REACT_APP_API_DATBIM}/api/datbim/portals/${selectedPortal}/objects`,
				params: { search: `${searchInput}` },
				headers: {
					'X-Auth-Token': sessionStorage.getItem('token')
				}
			});
			console.log('getObjectByKeyWord', objectsList)
			setObjectListDefault(objectsList.data.objects.data);
			setObjects(objectsList.data.objects.data);
			setObjectsLoader(false);
		} catch (error) {
			setObjects([]);
			setObjectsLoader(false);
		}


		// const objects = objectsList.reduce((acc, value) => {
		// 	if (value.data.properties) {
		// 		return acc.concat(value.data.properties);
		// 	}

		// 	return acc;
		// }, [])

	}
	return (
		<Grid container spacing={3}>
			<Grid item xs={8}>
				<SearchBar
					input={searchInput}
					onChange={searchObject}
					className={classes.searchBar}
					placeholder="Chercher un Objet"
				/>
			</Grid>
			<Grid item xs={4}>
				<Button
					className={classes.button}
					onClick={getObjectByKeyWord}
				>
					Recherche par mot clès
				</Button>
			</Grid>
			<Grid item xs={12}>
				{objectsLoader ?
					<Loader className="spinner-datbim" />
					:
					<>
						{objects?.map((object, index) => <Card key={index} className={`${classes.root} ${classes.datBimCard}`}>
							<CardContent onClick={() => {
								openProperties(object.object_id);
								handleNext();
							}}>
								<p className={classes.datBimCardTitle}>{object.parent_name}</p>
								<p className={classes.datBimCardTitle}>{object.organization_name} - {object.object_name}</p>
							</CardContent>
						</Card>
						)}
						{objects?.meta && <Pagination count={objects.meta.current_items} onChange={(e, value) => getObjects(typeProperties, value)} variant="outlined" />}
					</>
				}
			</Grid>
		</Grid >
	)
}

export default ObjectList;