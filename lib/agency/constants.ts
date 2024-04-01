import { BarChart, Calendar, CheckCircle, Clipboard, Compass, ComputerIcon, Database, Flag, Headphones, Home, Info, LinkIcon, Lock, MessageCircle, Music2, PersonStanding, Power, Receipt, Send, Settings, Shield, Star, Video, Wallet } from "lucide-react";
import { BiNotification } from "react-icons/bi";
import { BsPersonBadge } from "react-icons/bs";
import { FaRoad } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { MdPayment } from "react-icons/md";

export const pricingCards = [
  {
    title: 'Starter',
    description: 'Perfect for trying out plura',
    price: 'Free',
    duration: '',
    highlight: 'Key features',
    features: ['3 Sub accounts', '2 Team members', 'Unlimited pipelines'],
    priceId: '',
  },
  {
    title: 'Unlimited Saas',
    description: 'The ultimate agency kit',
    price: '$199',
    duration: 'month',
    highlight: 'Key features',
    features: ['Rebilling', '24/7 Support team'],
    priceId: 'price_1OYxkqFj9oKEERu1KfJGWxgN',
  },
  {
    title: 'Basic',
    description: 'For serious agency owners',
    price: '$49',
    duration: 'month',
    highlight: 'Everything in Starter, plus',
    features: ['Unlimited Sub accounts', 'Unlimited Team members'],
    priceId: 'price_1OYxkqFj9oKEERu1NbKUxXxN',
  },
]

export const addOnProducts = [
  { title: 'Priority Support', id: 'prod_PNjJAE2EpP16pn' },
]

export const icons = [
    {
      value: 'chart',
      label: 'Bar Chart',
      path: BarChart,
    },
    {
      value: 'headphone',
      label: 'Headphones',
      path: Headphones,
    },
    {
      value: 'send',
      label: 'Send',
      path: Send,
    },
    {
      value: 'pipelines',
      label: 'Pipelines',
      path: FaRoad,
    },
    {
      value: 'calendar',
      label: 'Calendar',
      path: Calendar,
    },
    {
      value: 'settings',
      label: 'Settings',
      path: Settings,
    },
    {
      value: 'check',
      label: 'Check Circled',
      path: CheckCircle,
    },
    {
      value: 'chip',
      label: 'Chip',
      path: ComputerIcon,
    },
    {
      value: 'compass',
      label: 'Compass',
      path: Compass,
    },
    {
      value: 'database',
      label: 'Database',
      path: Database,
    },
    {
      value: 'flag',
      label: 'Flag',
      path: Flag,
    },
    {
      value: 'home',
      label: 'Home',
      path: Home,
    },
    {
      value: 'info',
      label: 'Info',
      path: Info,
    },
    {
      value: 'link',
      label: 'Link',
      path: LinkIcon,
    },
    {
      value: 'lock',
      label: 'Lock',
      path: Lock,
    },
    {
      value: 'messages',
      label: 'Messages',
      path: MessageCircle,
    },
    {
      value: 'notification',
      label: 'Notification',
      path: BiNotification,
    },
    {
      value: 'payment',
      label: 'Payment',
      path: MdPayment,
    },
    {
      value: 'power',
      label: 'Power',
      path: Power,
    },
    {
      value: 'receipt',
      label: 'Receipt',
      path: Receipt,
    },
    {
      value: 'shield',
      label: 'Shield',
      path: Shield,
    },
    {
      value: 'star',
      label: 'Star',
      path: Star,
    },
    {
      value: 'tune',
      label: 'Tune',
      path: Music2,
    },
    {
      value: 'videorecorder',
      label: 'Video Recorder',
      path: Video,
    },
    {
      value: 'wallet',
      label: 'Wallet',
      path: Wallet,
    },
    {
      value: 'warning',
      label: 'Warning',
      path: IoWarning,
    },
    {
      value: 'person',
      label: 'Person',
      path: PersonStanding,
    },
    {
      value: 'category',
      label: 'Category',
      path: BsPersonBadge,
    },
    {
      value: 'clipboardIcon',
      label: 'Clipboard Icon',
      path: Clipboard,
    },
  ]

export type EditorBtns =
  | 'text'
  | 'container'
  | 'section'
  | 'contactForm'
  | 'paymentForm'
  | 'link'
  | '2Col'
  | 'video'
  | '__body'
  | 'image'
  | null
  | '3Col'

export const defaultStyles: React.CSSProperties = {
  backgroundPosition: 'center',
  objectFit: 'cover',
  backgroundRepeat: 'no-repeat',
  textAlign: 'left',
  opacity: '100%',
}