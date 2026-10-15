"use client"

import { Dispatch, SetStateAction, useState } from "react";
import T from "./typography";
import { useRouter } from "next/navigation";
import { PropertiesFilter } from "@/utils/propertyService";

type SearchBarProps = {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>
}

function Searchbar({
    search,
    setSearch
}: SearchBarProps) {
    return (
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}/>
    )
}

type PropertyFilterProps = {
    filter: PropertiesFilter
}

export default function PropertyFilter({ filter }: PropertyFilterProps) {
    const router = useRouter()
  const [search, setSearch] = useState(filter.city || "");

  const onFiltering = () => {
    router.push(`/?city=${search}`)
  }

  return (
    <div>
      <T.Header size="sm">[PROPERTIES FILTER]</T.Header>
      <Searchbar search={search} setSearch={setSearch}/>
      <button type="button" onClick={onFiltering}>
        Filter
      </button>
    </div>
  );
}
