"use client";

import { useSchedulePageAnalytics } from "@/analytics/schedule.analytics";
import useClickedOutside from "@/hooks/use-clicked-outside";
import MultiSelect from "@/components/ui/multi-select";
import OpenMultiSelect from "@/components/ui/open-multi-select";
import TagItem from "@/components/ui/tag-item";
import PlToggle from "@/components/ui/pl-toggle";
import { URL_QUERY_VALUE_SEPARATOR } from "@/utils/constants";
import { getQueryParams } from "@/utils/helper";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import PlSingleSelect from "@/components/ui/pl-single-select";

function FilterItem(props: any) {
  const router = useRouter();
  const initialFilters = props?.initialFilters;
  const selectedFilterValues = { ...props.selectedFilterValues };
  const searchParams = { ...props.searchParams };
  const type = props.type;
  const items = [...props.items];
  const name = props.name;
  const dropdownImgUrl = props.dropdownImgUrl ?? "";
  const iconUrl = props.iconUrl ?? "";
  const searchIcon = props.searchIcon;

  const [filteredItems, setFilteredItems] = useState(items);
  const [isPaneActive, setPaneStatus] = useState(false);
  const paneRef: any = useRef<HTMLElement>(null);
  const aligmentClass = type === "toggle" ? "row" : "col";
  const params = useParams();
  const view = params?.type as string;

  const { onScheduleFilterClicked, onFilterClearAllBtnClicked } =
    useSchedulePageAnalytics();

  useClickedOutside({
    ref: paneRef,
    callback: () => {
      setFilteredItems([...items]);
      setPaneStatus(false);
    },
  });

  const onInputChange = (value: any) => {
    setPaneStatus(true);
    if (value.trim() === "") {
      setFilteredItems([...items]);
    } else {
      const filteredValues = [...items].filter((v) => v.label.toLowerCase().includes(value.toLowerCase()));
      setFilteredItems([...filteredValues]);
    }
  };

  const onClearSelection = (e: any, key: any) => {
    e.preventDefault();
    e.stopPropagation();
    onFilterClearAllBtnClicked();
    setPaneStatus(false);
    if (key === "accessType") {
      delete searchParams["accessOption"];
    } else if (key === "venue") {
      delete searchParams["location"];
    } else if (key === "host") {
      delete searchParams["host"];
    }
    const pathname = window.location.pathname;
    const query = getQueryParams(searchParams);
    router.push(`${pathname}?${query}`);
  };

  const onMultiBoxClicked = () => {
    setPaneStatus((v) => !v);
  };

  const onMultiTagSelected = (item: any) => {
    // dispatch({ type: "setMultiTag", payload: { key: props.identifierId, value: item } });
  };

  const onItemClicked = (key: any, value: any) => {
    onScheduleFilterClicked(key, value, view);
    // Featured
    if (key === "isFeatured") {
      searchParams[key] = value;
      if (initialFilters[key] === searchParams[key]) {
        delete searchParams[key];
      }
    }

    // Modes
    else if (key === "modes") {
      let selectedModes = [...selectedFilterValues.modes];
      if (value === "All") {
        selectedModes = [];
        delete searchParams[key];
      } else {
        selectedModes = selectedModes.filter((mode: any) => mode !== "All");
        if (selectedModes.includes(value)) {
          selectedModes = selectedModes.filter((mode: any) => mode !== value);
        } else {
          selectedModes.push(value);
        }
        searchParams[key] = selectedModes.join(URL_QUERY_VALUE_SEPARATOR);
      }
    }

    // Access type
    else if (key === "accessType") {
      let selectedAccessOptions = [...selectedFilterValues.accessOption];
      if (selectedAccessOptions.includes(value)) {
        selectedAccessOptions = selectedAccessOptions.filter((option: any) => option !== value);
      } else {
        selectedAccessOptions.push(value);
      }
      searchParams["accessOption"] = selectedAccessOptions.join(URL_QUERY_VALUE_SEPARATOR);
    }

    // Venue
    else if (key === "venue") {
      let selectedLocation = [...selectedFilterValues.location];
      if (selectedLocation.includes(value)) {
        selectedLocation = selectedLocation.filter((option: any) => option !== value);
      } else {
        selectedLocation.push(value);
      }
      searchParams["location"] = selectedLocation.join(URL_QUERY_VALUE_SEPARATOR);
    }

    // Host
    else if (key === "host") {
      let selectedHosts = [...selectedFilterValues.allHost];
      if (selectedHosts.includes(value)) {
        selectedHosts = selectedHosts.filter((option: any) => option !== value);
      } else {
        selectedHosts.push(value);
      }
      searchParams[key] = selectedHosts.join(URL_QUERY_VALUE_SEPARATOR);
    }

    // Tags
    else if (key === "tags") {
      let selectedTags = [...selectedFilterValues.tags];
      if (selectedTags.includes(value)) {
        selectedTags = selectedTags.filter((option: any) => option !== value);
      } else {
        selectedTags.push(value);
      }
      searchParams[key] = selectedTags.join(URL_QUERY_VALUE_SEPARATOR);
    }

    // Year
    else if (key === "year") {
      searchParams[key] = value;
    }

    const query = getQueryParams(searchParams);
    const pathname = window.location.pathname;
    router.push(`${pathname}?${query}`);
  };

  return (
    <>
      <div className={`fi fi--${aligmentClass} fi--${type}`}>
        <h2 className={`fi__title fi__title--${type}`}>{name}</h2>
        {type === "toggle" && <PlToggle callback={onItemClicked} itemId={props.identifierId} activeItem={props.isChecked} {...props} />}
        {type === "multi-select" && (
          <div ref={paneRef}>
            <MultiSelect
              {...props}
              itemId={props.identifierId}
              closeImg={`/icons/close_grey.svg`}
              tickImg={`/icons/tick.svg`}
              selectedItems={props.selectedItems}
              onItemSelected={onItemClicked}
              filteredItems={filteredItems}
              onInputChange={onInputChange}
              name={name}
              dropdownImgUrl={dropdownImgUrl}
              iconUrl={iconUrl}
              searchIcon={searchIcon}
              onMultiBoxClicked={onMultiBoxClicked}
              isPaneActive={isPaneActive}
              items={props.items}
              onClearSelection={onClearSelection}
            />
          </div>
        )}
        {type === "single-select" && <PlSingleSelect callback={onItemClicked} {...props} />}
        {type === "tag" && (
          <div className="tags">
            {items.map((item, itemIndex) => (
              <div className="tags__item" key={item.name}>
                <TagItem
                  callback={onItemClicked}
                  {...props}
                  activeImg={item.activeImg}
                  inActiveImg={item.inActiveImg}
                  isActive={props.selectedItems.includes(item.name)}
                  text={item.label}
                  value={item.name}
                />
              </div>
            ))}
          </div>
        )}
        {type === "open-multi-select" && (
          <OpenMultiSelect
            {...props}
            name={name}
            dropdownImgUrl={dropdownImgUrl}
            iconUrl={iconUrl}
            searchIcon={searchIcon}
            onMultiBoxClicked={onMultiBoxClicked}
            isPaneActive={isPaneActive}
            items={props.items}
            selectedItems={[...props.selectedItems]}
            onItemSelected={onItemClicked}
            filteredItems={filteredItems}
            onInputChange={onInputChange}
            tickImg={`/icons/tick.svg`}
          />
        )}
      </div>
      <style jsx>
        {`
          .fi {
            display: flex;
            gap: 12px;
            padding: 0 16px;
          }
          .fi--row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
          .fi--col {
            flex-direction: column;
          }
          .fi--toggle {
            padding-bottom: 16px;
            border-bottom: 1px solid #cbd5e1;
          }
          .fi__title {
            color: #0f172a;
            font-weight: 600;
            font-size: 14px;
          }

          .fi__title--toggle {
            font-weight: 400;
            font-size: 13px;
          }
          .tags {
            display: grid;
            width: 100%;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .tags__item {
            flex: ;
          }
        `}
      </style>
    </>
  );
}

export default FilterItem;
