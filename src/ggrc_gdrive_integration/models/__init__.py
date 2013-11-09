
import ggrc.models.all_models #import all_models,  __all__
from .object_folder import ObjectFolder
from .object_file import ObjectFile
import sys

ggrc.models.all_models.ObjectFolder = ObjectFolder
ggrc.models.all_models.ObjectFile = ObjectFile
ggrc.models.all_models.all_models += [ObjectFolder, ObjectFile]
ggrc.models.all_models.__all__ += [ObjectFolder.__name__, ObjectFile.__name__]
