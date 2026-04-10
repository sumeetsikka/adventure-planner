import type { Destination } from '../types';

// Country-specific destination data
import { destinations as vietnam } from './countries/vietnam';
import { destinations as thailand } from './countries/thailand';
import { destinations as japan } from './countries/japan';
import { destinations as indonesia } from './countries/indonesia';
import { destinations as philippines } from './countries/philippines';
import { destinations as cambodia } from './countries/cambodia';
import { destinations as italy } from './countries/italy';
import { destinations as france } from './countries/france';
import { destinations as spain } from './countries/spain';
import { destinations as portugal } from './countries/portugal';
import { destinations as greece } from './countries/greece';
import { destinations as switzerland } from './countries/switzerland';
import { destinations as germany } from './countries/germany';
import { destinations as netherlands } from './countries/netherlands';
import { destinations as belgium } from './countries/belgium';
import { destinations as austria } from './countries/austria';
import { destinations as norway } from './countries/norway';
import { destinations as sweden } from './countries/sweden';
import { destinations as morocco } from './countries/morocco';
import { destinations as egypt } from './countries/egypt';
import { destinations as turkey } from './countries/turkey';
import { destinations as mauritius } from './countries/mauritius';
import { destinations as peru } from './countries/peru';
import { destinations as mexico } from './countries/mexico';
import { destinations as newzealand } from './countries/newzealand';
import { destinations as maldives } from './countries/maldives';
import { destinations as croatia } from './countries/croatia';
import { destinations as iceland } from './countries/iceland';
import { destinations as fiji } from './countries/fiji';

const countryDestinations: Record<string, Destination[]> = {
  vietnam, thailand, japan, indonesia, philippines, cambodia,
  italy, france, spain, portugal, greece, switzerland,
  germany, netherlands, belgium, austria, norway, sweden,
  morocco, egypt, turkey, mauritius,
  peru, mexico,
  newzealand,
  maldives,
  croatia, iceland, fiji,
};

export function getDestinationsForCountry(countryId: string): Destination[] | null {
  return countryDestinations[countryId] || null;
}

export const destinations = vietnam;
