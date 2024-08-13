async function search() {
  searchLoading.value = true
  let data = {
    page: 1,
    limit: 20,
  }
  userStore.$state.currentPage = 1

  try {
    const queryParams = {}

    Object.keys(filterData.value).forEach(key => {
      if (nullCheck(filterData.value[key])) {
        if (dateTitles.value.includes(key)) {
          filterData.value[key] = new Date(filterData.value[key]).toISOString()
        }
        data[key] = filterData.value[key]
        if (key !== 'page' && key !== 'limit') {
          queryParams[key] = filterData.value[key]
        }
      }
    })

    let searchRes = await userStore.getAllUsers(data)
    if (searchRes) {
      userStore.$state.isFiltered = true
      userStore.$state.filterData = data
      router.push({
        query: {
          ...router.currentRoute.value.query,
          ...queryParams,
        },
      })
      close()
    } else {
      globalState.notification('Uygun kullanıcı bulunamadı.', 'error', 3000, true)
    }
  } finally {
    searchLoading.value = false
  }
}
