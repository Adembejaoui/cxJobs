import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface JobTagsProps {
  location: string
  contractType: string
  workMode: string
  languages: string[]
  skills: string[]
}

export function JobTags({ location, contractType, workMode, languages, skills }: JobTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Badge variant="secondary" className="gap-1">
        <MapPin className="h-3 w-3" />
        {location}
      </Badge>
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
        {contractType}
      </Badge>
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
        {workMode}
      </Badge>
      {languages.map((lang, idx) => (
        <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          {lang}
        </Badge>
      ))}
    
    </div>
  )
}
