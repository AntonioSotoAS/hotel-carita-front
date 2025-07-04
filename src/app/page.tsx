// Component Imports
import LandingPageWrapper from '@views/front-pages/landing-page'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const HomePage = () => {
  // Vars
  const mode = getServerMode()

  return <LandingPageWrapper mode={mode} />
}

export default HomePage
