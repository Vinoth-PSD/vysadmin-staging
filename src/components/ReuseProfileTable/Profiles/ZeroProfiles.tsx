import React from 'react';
import ProbsProfiletable from '../ProbsProfileTable';



const NewlyRegisteredProfiles: React.FC = () => {
  return <ProbsProfiletable   pageNameValue={0} heading={'New Profiles'} />; // Pass the pageNameValue prop here
};

export default NewlyRegisteredProfiles;
