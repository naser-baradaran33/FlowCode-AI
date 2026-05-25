
import { Spinner } from "@/components/ui/spinner";
import { useProjectsPartial } from "./hooks/use-projects";


interface ProjectsListProps {
    onViewAll: () => void;
}

export const ProjectsList = ({ onViewAll }: ProjectsListProps) => {
    const projects = useProjectsPartial(6);
    
    if (projects === undefined) {
        return <Spinner className="size-4 text-ring" />;
    }

    const [mostRecent, ...rest] = projects;

    return (
        <div className="flex flex-col gap-4">
            {rest.length > 0 && (
                <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground ">
                        Recent Projects
                    </span>
                </div>
            
                </div>
            )}
        </div>
    );
};