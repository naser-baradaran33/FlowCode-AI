/* eslint-disable react-hooks/purity */


import {useMutation, useQuery } from "convex/react";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";


export const useProjects = (projectId: Id<"projects">) => {
    return useQuery(api.projects.getById, { id: projectId });
};


export const useProjectsPartial = (limit: number) => {
    return useQuery(api.projects.getPartial, { limit });
};


export const useCreateProject = () => {
    return useMutation(api.projects.create).withOptimisticUpdate((
        localStore, args) => {
            const exitingProjects = localStore.getQuery(api.projects.getPartial, { limit: 10 });
            if (exitingProjects !== undefined) {
                const now = Date.now();
                const newProject = {
                    _id: crypto.randomUUID() as Id<"projects">,
                    _creationTime: now,
                    name: args.name,
                    ownerId: "anonymous",
                    updatedAt: now,
                    };
                localStore.setQuery(api.projects.get, {}, [newProject, ...exitingProjects]);
            }
        }
    );
};

export const useRenameProject = (projectId: Id<"projects">) => {
    return useMutation(api.projects.rename).withOptimisticUpdate((
        localStore, args) => {
            const exitingProjects = localStore.getQuery(api.projects.getById, { id: projectId });


            if (exitingProjects !== undefined && exitingProjects !== null) {
                localStore.setQuery(api.projects.getById, { id: projectId }, {
                    ...exitingProjects,
                    name: args.name,
                    updatedAt: Date.now(),
                }
            );            
            }

            const exitingProjects = localStore.getQuery(api.projects.get);

            if (exitingProjects !== undefined) {
                localStore.setQuery(api.projects.get, {}, 
                    exitingProjects.map((project) => {
                       return project._id === args.id ? {
                                ...project,
                                name: args.name,
                                updatedAt: Date.now(),}
                            : project;
                       
                    })
                );
            }
        }
    );
};