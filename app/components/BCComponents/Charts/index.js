import numeral from 'numeral';
import './g2';
import ChartCard from './ChartCard';
import Bar from './Bar';
import Fold from './FoldChart';
import Pie from './Pie';
import Radar from './Radar';
import Gauge from './Gauge';
import MiniArea from './MiniArea';
import MiniBar from './MiniBar';
import MiniProgress from './MiniProgress';
import Field from './Field';
import WaterWave from './WaterWave';
import TagCloud from './TagCloud';
import TimelineChart from './TimelineChart';
import FoldlineChart from './FoldlineChart';
import IdentityChart from './IdentityChart';
import BarTimeLine from './BarTimeLine';

const yuan = val => `&yen; ${numeral(val).format('0,0')}`;

export {
  yuan,
  Bar,Fold,
  Pie,
  Gauge,
  Radar,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
  TimelineChart,
  FoldlineChart,
  IdentityChart,
  BarTimeLine
};
