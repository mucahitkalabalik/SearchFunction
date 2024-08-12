async function search() {
  searchLoading.value = true
  let data = {
    page: 1,
    limit: 20,
  }
  userStore.$state.currentPage = 1

  const filterDataKeys = Object.keys(filterData.value)
  filterDataKeys.forEach(filterKey => {
    if (nullCheck(filterData.value[filterKey])) {
      dateTitles.value.forEach(date => {
        if (date === filterKey) {
          filterData.value[filterKey] = new Date(filterData.value[filterKey]).toISOString()
        }
      })
      data[filterKey] = filterData.value[filterKey]
    }
  })
  const queryParams = {}

  filterDataKeys.forEach(key => {
    if (key !== 'page' && key !== 'limit') {
      queryParams[key] = filterData.value[key]
    }
  })

  router.push({
    query: {
      ...router.currentRoute.value.query,
      ...queryParams,
    },
  })

  let searchRes = await userStore.getAllUsers(data)
  if (searchRes) {
    ;(userStore.$state.isFiltered = true), (userStore.$state.filterData = data)
    close()
  } else {
    globalState.notification('Uygun kullanıcı bulunamadı.', 'error', 3000, true)
  }
  searchLoading.value = false
}
